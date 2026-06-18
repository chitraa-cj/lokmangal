// Daily planner scheduler.
//
// Each day, every category is published `minPerCategory` times, and with
// probability `extraChance` one additional time (up to `maxPerCategory`).
// Each article is published at a RANDOM time within the daily window
// [dayStart, dayEnd] in the editorial timezone.
//
// Restart-safe: the per-day target is deterministic per (day, category) and we
// only schedule the remainder not already published today, so a restart never
// exceeds the daily cap.
import crypto from "crypto";
import cron from "node-cron";
import { env, CATEGORIES } from "./config.js";
import { runCategory } from "./pipeline.js";
import { todayDay } from "./timeline.js";
import { publishedTodayCount } from "./state.js";

// ---- single-flight queue so publishes never overlap (rate limits, source races) ----
let chain = Promise.resolve();
function enqueue(label, fn) {
  chain = chain.then(
    () => runGuarded(label, fn),
    () => runGuarded(label, fn)
  );
  return chain;
}
async function runGuarded(label, fn) {
  try {
    await fn();
  } catch (err) {
    console.error(`[autopilot] ${label} failed:`, err.message);
  }
}

// Deterministic float in [0,1) for a string (so a day's plan is stable across restarts).
function seededFloat(str) {
  const hex = crypto.createHash("sha256").update(str).digest("hex").slice(0, 8);
  return parseInt(hex, 16) / 0x100000000;
}

// Decide how many articles a category gets today (stable per day+category).
function dailyTarget(category, day) {
  let count = env.minPerCategory;
  for (let i = env.minPerCategory; i < env.maxPerCategory; i++) {
    if (seededFloat(`${day}|${category}|${i}`) < env.extraChance) count++;
    else break;
  }
  return count;
}

function hhmmToSec(hhmm) {
  const [h, m] = String(hhmm).split(":").map((x) => parseInt(x, 10));
  return (Number.isFinite(h) ? h : 0) * 3600 + (Number.isFinite(m) ? m : 0) * 60;
}

// Current seconds-since-midnight in the editorial timezone.
function nowSecInTz() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: env.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t) => parseInt(parts.find((p) => p.type === t)?.value || "0", 10);
  return get("hour") * 3600 + get("minute") * 60 + get("second");
}

// Plan (or re-plan) the rest of today: schedule the remaining publishes per category.
async function planDay() {
  const day = todayDay();
  const startSec = hhmmToSec(env.dayStart);
  const endSec = hhmmToSec(env.dayEnd);
  const nowSec = nowSecInTz();
  const earliest = Math.max(nowSec + 60, startSec); // at least 1 min out

  if (earliest >= endSec) {
    console.log(`[autopilot] planDay ${day}: window [${env.dayStart}-${env.dayEnd}] has passed`);
    return;
  }

  let scheduled = 0;
  for (const category of CATEGORIES) {
    const target = dailyTarget(category, day);
    let alreadyDone = 0;
    try {
      alreadyDone = await publishedTodayCount(category, day);
    } catch (_) {}
    const remaining = Math.max(0, target - alreadyDone);
    for (let i = 0; i < remaining; i++) {
      const at = earliest + Math.floor(Math.random() * (endSec - earliest));
      const delayMs = (at - nowSec) * 1000;
      const hh = String(Math.floor(at / 3600)).padStart(2, "0");
      const mm = String(Math.floor((at % 3600) / 60)).padStart(2, "0");
      setTimeout(() => {
        enqueue(`${category} @${hh}:${mm}`, async () => {
          console.log(`[autopilot] publishing ${category} (random slot ${hh}:${mm})`);
          const r = await runCategory(category);
          console.log(`[autopilot] ${category}: ${r.status}${r.headline ? ` — ${r.headline}` : ""}`);
        });
      }, delayMs);
      scheduled++;
      console.log(`[autopilot] scheduled ${category} at ~${hh}:${mm} ${env.timezone}`);
    }
  }
  console.log(
    `[autopilot] planDay ${day}: ${scheduled} publish(es) scheduled across ${CATEGORIES.length} categories`
  );
}

export function startScheduler() {
  if (!env.enabled) {
    console.log("[autopilot] disabled (AUTOPILOT_ENABLED=false) — scheduler not started");
    return;
  }
  if (!env.openaiKey) {
    console.warn("[autopilot] OPENAI_API_KEY missing — scheduler not started");
    return;
  }

  const lo = env.minPerCategory;
  const hi = env.maxPerCategory;
  console.log(
    `[autopilot] enabled — ${lo}${hi > lo ? `-${hi}` : ""} article(s)/category/day at random times ` +
      `in [${env.dayStart}-${env.dayEnd}] ${env.timezone} (~${lo * CATEGORIES.length}-${hi * CATEGORIES.length}/day)`
  );

  // Re-plan each day at 00:05 (editorial tz).
  cron.schedule("5 0 * * *", () => planDay(), { timezone: env.timezone });

  // Plan the remainder of today now (slightly delayed so the DB connection is ready).
  setTimeout(() => planDay().catch((e) => console.error("[autopilot] initial planDay failed:", e.message)), 5000);
}
