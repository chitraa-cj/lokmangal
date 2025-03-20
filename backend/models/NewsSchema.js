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
    // MainNews-specific fields (optional for other types)
    navbarCategories: { type: [String], default: [] },
    hashtags: { type: [String], default: [] },
    footerTags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Indexes for performance
NewsSchema.index({ articleType: 1, createdAt: -1 }); // For reader queries
NewsSchema.index({ createdAt: -1 }); // For admin pagination

const News = mongoose.model("News", NewsSchema);
export default News;
