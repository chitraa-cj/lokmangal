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
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videoSchema);
export default Video;
