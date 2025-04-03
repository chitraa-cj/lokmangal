import mongoose from "mongoose";

const NewsSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String },
    imgUrl: { type: String },
    content: { type: String },
    articleType: {
      type: String,
      required: true,
      enum: ["breakingNews", "main", "left", "right", "grid"],
    },
    navbarCategories: { type: String },
    hashtags: { type: [String] },
    footerTags: { type: String },
    views: { type: Number, default: 0 },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

NewsSchema.index({ articleType: 1, createdAt: -1 });
NewsSchema.index({ createdAt: -1 });

const News = mongoose.model("News", NewsSchema);
export default News;
