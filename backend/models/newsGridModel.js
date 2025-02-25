import mongoose from "mongoose";

const newsGridSchema = mongoose.Schema(
  {
    // navbarCategories: { type: [String], required: true },
    // hashtags: { type: [String], required: true },
    // footerTags: { type: [String], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    imgUrl: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const GridNews = mongoose.model("GridNews", newsGridSchema);

export default GridNews;
