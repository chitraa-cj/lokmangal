import mongoose from "mongoose";

const newsPostSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    excerpt: { type: String, required: true },
    imgUrl: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const NewsPost = mongoose.model("NewsPost", newsPostSchema);

export default NewsPost;
