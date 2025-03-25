import express from "express";
import {
  getAllNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  getNewsPostsByUser,
  getNewsPostsByCategory,
  getWeather,
  getAllNewsPostsAdmin,
} from "../controllers/newsPostController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// General routes
router.route("/").get(getAllNewsPosts).post(protect, isAdmin, createNewsPost);
router.route("/weather").get(getWeather);
router.route("/all").get(getAllNewsPostsAdmin);

// ID-based routes (generic) - Place AFTER specific routes
router
  .route("/:id")
  .put(protect, isAdmin, updateNewsPost)
  .delete(protect, isAdmin, deleteNewsPost);

// Category route (specific) - Place BEFORE /:id
router.route("/category/:category").get(getNewsPostsByCategory);

// Type/ID route
router.route("/:type/:id").get(getNewsPostById);

// User-specific route
router.route("/user/:userId").get(protect, getNewsPostsByUser);

export default router;
