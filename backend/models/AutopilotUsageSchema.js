import mongoose from "mongoose";

// Per-day OpenAI usage meter for the autopilot. Persisted so the daily spend cap
// survives process restarts (an in-memory counter alone could be bypassed by a
// crash-loop and run up a bill). One document per editorial day.
const AutopilotUsageSchema = mongoose.Schema(
  {
    day: { type: String, required: true, unique: true, index: true }, // YYYY-MM-DD (editorial tz)
    calls: { type: Number, default: 0 },
    promptTokens: { type: Number, default: 0 },
    completionTokens: { type: Number, default: 0 },
    totalTokens: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const AutopilotUsage = mongoose.model("AutopilotUsage", AutopilotUsageSchema);
export default AutopilotUsage;
