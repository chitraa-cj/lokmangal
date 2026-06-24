// Backfill for the "Our City" per-city tagging.
//
// Some autopilot articles were stored under the bare umbrella "हमारा शहर" instead
// of the per-city convention "हमारा शहर <City>", so they show under no city page.
// This re-tags each such article with its specific city, detected from the
// title/conclusion/body.
//
// Safe to re-run: it only touches docs tagged with the bare umbrella and only
// changes one string field. Docs where no known city is mentioned are left as-is
// and reported.
//
//   node backend/scripts/migrateCityCategories.js            # apply
//   node backend/scripts/migrateCityCategories.js --dry-run  # report only
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import News from "../models/NewsSchema.js";
import { CITY_CATEGORY, detectCity } from "../automation/cities.js";

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  await connectDB();

  // Exact match on the bare umbrella string (not the "हमारा शहर <City>" docs).
  const docs = await News.find(
    { navbarCategories: CITY_CATEGORY },
    { title: 1, conclusion: 1, content: 1 }
  ).lean();
  console.log(`Found ${docs.length} bare "${CITY_CATEGORY}" article(s) to re-tag${dryRun ? " (dry run)" : ""}.`);

  const byCity = {};
  let updated = 0;
  const unresolved = [];
  for (const d of docs) {
    const city = detectCity(`${d.title || ""}\n${d.conclusion || ""}\n${d.content || ""}`);
    if (!city) {
      unresolved.push(d.title?.replace(/<[^>]+>/g, "").trim().slice(0, 80) || String(d._id));
      continue;
    }
    byCity[city] = (byCity[city] || 0) + 1;
    if (!dryRun) await News.updateOne({ _id: d._id }, { $set: { navbarCategories: `${CITY_CATEGORY} ${city}` } });
    updated++;
  }

  console.log(`${dryRun ? "Would re-tag" : "Re-tagged"} ${updated} article(s):`, byCity);
  if (unresolved.length) {
    console.log(`Left ${unresolved.length} unresolved (no known city detected):`);
    unresolved.forEach((t) => console.log(`  - ${t}`));
  }
  await mongoose.connection.close();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Migration failed:", err);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});
