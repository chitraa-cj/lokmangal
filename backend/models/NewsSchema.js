import mongoose from "mongoose";

const NewsSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    imgUrl: { type: String },
    content: { type: String, required: true },
    articleType: {
      type: String,
      required: true,
      enum: ["breakingNews", "main", "left", "right", "grid"],
    },
    navbarCategories: { type: String },
    hashtags: { type: [String] },
    footerTags: { type: String },
    views: { type: Number, default: 0 }, // Add views counter
  },
  { timestamps: true }
);

NewsSchema.index({ articleType: 1, createdAt: -1 });
NewsSchema.index({ createdAt: -1 });

const News = mongoose.model("News", NewsSchema);
export default News;
