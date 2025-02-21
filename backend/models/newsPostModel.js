import mongoose from "mongoose";

const newsPostSchema = mongoose.Schema(
  {
    articleType: {
      type: String,
      enum: ["main", "left", "right", "grid"],
      required: true,
    },
    navbarCategories: { type: [String], required: true },
    hashtags: { type: [String], required: true },
    footerTags: { type: [String], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    conclusion: { type: String, required: true },
    imgUrl: { type: String, required: true },
    content: { type: String, required: true },
    position: { type: Number },
  },
  { timestamps: true }
);

const NewsPost = mongoose.model("NewsPost", newsPostSchema);

export default NewsPost;
