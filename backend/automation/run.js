// Manual runner for the News Autopilot (testing / on-demand publishing).
//
//   node backend/automation/run.js                 # one wave, all categories
//   node backend/automation/run.js --category खेल   # single category
//   node backend/automation/run.js --dry-run        # scrape+rewrite, no DB writes
//
// Honors AUTOPILOT_DRY_RUN from .env; --dry-run forces it on.
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import { env, CATEGORIES } from "./config.js";
import { runCategory, runWave } from "./pipeline.js";

function arg(name) {
  const i = process.argv.indexOf(name);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  if (process.argv.includes("--dry-run")) env.dryRun = true;
  await connectDB();

  const category = arg("--category");
  let result;
  if (category) {
    if (!CATEGORIES.includes(category)) {
      console.error(`Unknown category "${category}". Valid: ${CATEGORIES.join(", ")}`);
      process.exit(1);
    }
    result = await runCategory(category);
  } else {
    result = await runWave();
  }

  console.log("\n=== Autopilot result ===");
  console.log(JSON.stringify(result, null, 2));
  await mongoose.connection.close();
  process.exit(0);
}

main().catch(async (err) => {
  console.error("Autopilot run failed:", err);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});
