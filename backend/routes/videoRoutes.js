import express from "express";
import {
  getVideos,
  createVideo,
  deleteVideo,
} from "../controllers/videoController.js";
// Assuming you have auth middleware
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getVideos).post(protect, isAdmin, createVideo);

router.route("/:type").delete(protect, isAdmin, deleteVideo);

export default router;
