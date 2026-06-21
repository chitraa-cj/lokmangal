// Standalone News Autopilot scheduler.
//
// The autopilot already starts automatically inside the web server
// (server.js → startScheduler) when AUTOPILOT_ENABLED=true. Use THIS file only if
// you want to run the cron as its OWN long-running process, separate from the web
// server:
//
//   node backend/automation/start.js
//   pm2 start backend/automation/start.js --name lokmangal-autopilot --time
//
import dotenv from "dotenv";
dotenv.config();
import connectDB from "../config/db.js";
import { env } from "./config.js";
import { startScheduler } from "./scheduler.js";

await connectDB();

if (!env.enabled) {
  console.warn("[autopilot] AUTOPILOT_ENABLED is not true — set it in .env to schedule publishing.");
}

startScheduler();
console.log("[autopilot] standalone scheduler running; leave this process up.");

// Keep the process alive (node-cron timers run on this event loop).
setInterval(() => {}, 1 << 30);
