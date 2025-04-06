import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["main", "iframe"],
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    totalViews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
