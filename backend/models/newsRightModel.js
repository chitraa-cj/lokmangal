import mongoose from "mongoose";

const newsRightSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    // imgUrl: { type: String, required: true },
    imgUrl: { type: String },
    content: { type: String, required: true },
    articleType: { type: String, required: true, default: "right" },
  },
  { timestamps: true }
);

const RightNews = mongoose.model("RightNews", newsRightSchema);

export default RightNews;
