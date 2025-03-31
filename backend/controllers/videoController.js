import asyncHandler from "../middleware/asyncHandler.js";
import Video from "../models/VideoModel.js";

/**
 * @desc Get all videos
 * @route GET /api/videos
 * @access Public
 */
const getVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find({});
  res.json(videos);
});

/**
 * @desc Create or update video URL
 * @route POST /api/videos
 * @access Private/Admin
 */
const createVideo = asyncHandler(async (req, res) => {
  const { type, videoId } = req.body;

  if (!type || !videoId) {
    res.status(400);
    throw new Error("Type and video ID are required");
  }

  if (!["main", "iframe"].includes(type)) {
    res.status(400);
    throw new Error("Invalid video type. Must be 'main' or 'iframe'");
  }

  // Function to extract video ID from various YouTube URL formats
  const extractVideoId = (input) => {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match?.[1]) return match[1];
    }
    return input; // Return as-is if no match found
  };

  const extractedId = extractVideoId(videoId);

  // Validate video ID format
  if (!/^[a-zA-Z0-9_-]{11}$/.test(extractedId)) {
    res.status(400);
    throw new Error("Invalid YouTube video ID format");
  }

  // Generate full embed URL
  // const url = `https://www.youtube.com/embed/${extractedId}?controls=0&autoplay=1&mute=1&loop=1`;
  const url = `https://www.youtube.com/embed/${extractedId}?autoplay=1&mute=1&loop=1`;

  const existingVideo = await Video.findOne({ type });

  if (existingVideo) {
    existingVideo.url = url;
    await existingVideo.save();
    res.status(200).json(existingVideo);
  } else {
    const video = new Video({
      type,
      url,
    });
    const createdVideo = await video.save();
    res.status(201).json(createdVideo);
  }
});

/**
 * @desc Delete video
 * @route DELETE /api/videos/:type
 * @access Private/Admin
 */
const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findOne({ type: req.params.type });

  if (video) {
    await video.remove();
    res.json({ message: "Video removed" });
  } else {
    res.status(404);
    throw new Error("Video not found");
  }
});

export { getVideos, createVideo, deleteVideo };
