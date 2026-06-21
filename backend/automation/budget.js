// OpenAI spend cap for the autopilot — a hard ceiling on API calls and tokens
// per editorial day, so a runaway loop or a bad day of retries can never run up a
// large OpenAI bill. Every OpenAI call in the pipeline goes through this meter
// (see openaiClient.js): the cap is checked BEFORE each call and the real usage
// (from the API response) is recorded AFTER.
//
// The day's totals are persisted in MongoDB so the cap survives restarts — an
// in-memory counter alone could be reset by a crash-loop. We keep a warm
// in-memory copy (loaded once per day) so the pre-call check stays cheap.
import AutopilotUsage from "../models/AutopilotUsageSchema.js";
import { env } from "./config.js";
import { todayDay } from "./timeline.js";

let meter = { day: null, calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };

// Thrown when a daily cap is hit. Carries a flag so callers can stop the wave
// (rather than treating it like a normal, retryable failure).
export class BudgetExceededError extends Error {
  constructor(message) {
    super(message);
    this.name = "BudgetExceededError";
    this.budgetExceeded = true;
  }
}

// Load today's totals from the DB the first time we see a new day.
async function ensureLoaded() {
  const day = todayDay();
  if (meter.day === day) return;
  let doc = null;
  try {
    doc = await AutopilotUsage.findOne({ day }).lean();
  } catch (_) {
    /* DB unavailable — start the day at zero in memory */
  }
  meter = {
    day,
    calls: doc?.calls || 0,
    promptTokens: doc?.promptTokens || 0,
    completionTokens: doc?.completionTokens || 0,
    totalTokens: doc?.totalTokens || 0,
  };
}

// Throw if a daily cap has already been reached. Call BEFORE every OpenAI request.
export async function assertBudget() {
  if (!env.budgetEnabled) return;
  await ensureLoaded();
  if (env.maxDailyCalls > 0 && meter.calls >= env.maxDailyCalls) {
    throw new BudgetExceededError(
      `daily OpenAI call cap reached (${meter.calls}/${env.maxDailyCalls}) — pausing until tomorrow`
    );
  }
  if (env.maxDailyTokens > 0 && meter.totalTokens >= env.maxDailyTokens) {
    throw new BudgetExceededError(
      `daily OpenAI token cap reached (${meter.totalTokens}/${env.maxDailyTokens}) — pausing until tomorrow`
    );
  }
}

// Record actual usage from an API response. Call AFTER every OpenAI request.
export async function recordUsage(usage) {
  if (!env.budgetEnabled) return;
  await ensureLoaded();
  const prompt = usage?.prompt_tokens || 0;
  const completion = usage?.completion_tokens || 0;
  const total = usage?.total_tokens || prompt + completion;

  meter.calls += 1;
  meter.promptTokens += prompt;
  meter.completionTokens += completion;
  meter.totalTokens += total;

  // Persist atomically so concurrent/parallel runs and restarts stay consistent.
  try {
    await AutopilotUsage.updateOne(
      { day: meter.day },
      { $inc: { calls: 1, promptTokens: prompt, completionTokens: completion, totalTokens: total } },
      { upsert: true }
    );
  } catch (_) {
    /* keep the in-memory count even if the write fails */
  }
}

// Snapshot of today's usage (for logging / status).
export async function usageStats() {
  await ensureLoaded();
  return {
    day: meter.day,
    calls: meter.calls,
    totalTokens: meter.totalTokens,
    maxDailyCalls: env.maxDailyCalls,
    maxDailyTokens: env.maxDailyTokens,
  };
}
