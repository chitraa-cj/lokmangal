import mongoose from "mongoose";

const mainNewsSchema = mongoose.Schema(
  {
    navbarCategories: { type: [String], required: true },
    hashtags: { type: [String], required: true },
    footerTags: { type: [String], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    imgUrl: { type: String },
    // imgUrl: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, required: true, default: "main" },
  },
  { timestamps: true }
);

const MainNews = mongoose.model("MainNews", mainNewsSchema);

export default MainNews;
