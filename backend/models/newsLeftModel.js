import mongoose from "mongoose";

const newsLeftSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    // imgUrl: { type: String, required: true },
    imgUrl: { type: String },
    content: { type: String, required: true },
    type: { type: String, required: true, default: "left" },
  },
  { timestamps: true }
);

const LeftNews = mongoose.model("LeftNews", newsLeftSchema);

export default LeftNews;
