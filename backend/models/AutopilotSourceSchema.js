import mongoose from "mongoose";

// Records every source article the autopilot has already used, so the same
// story is never scraped/published twice ("not already covered by us").
const AutopilotSourceSchema = mongoose.Schema(
  {
    sourceId: { type: String, required: true, unique: true, index: true },
    sourceUrl: { type: String },
    sourceName: { type: String },
    category: { type: String },
    title: { type: String },
    day: { type: String, index: true }, // YYYY-MM-DD (editorial tz)
    newsPostId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    dryRun: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AutopilotSource = mongoose.model("AutopilotSource", AutopilotSourceSchema);
export default AutopilotSource;
