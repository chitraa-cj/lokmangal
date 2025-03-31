import express from "express";
import {
  getAllNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  getNewsPostsByUser,
  getNewsPostsByCategory,
  getNewsPostsByHashtag,
  getNewsPostsByFooterTag,
  searchNewsPosts,
  getWeather,
  getAllNewsPostsAdmin,
  getAllHashtags,
  // incrementArticleViews,
  trackArticleView,
} from "../controllers/newsPostController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// General routes
router.route("/").get(getAllNewsPosts).post(protect, isAdmin, createNewsPost);
router.route("/weather").get(getWeather);
router.get("/hashtags", getAllHashtags);
router.route("/all").get(getAllNewsPostsAdmin);

// ID-based routes (generic) - Place AFTER specific routes
router
  .route("/:id")
  .put(protect, isAdmin, updateNewsPost)
  .delete(protect, isAdmin, deleteNewsPost);

router.route("/category/:category").get(getNewsPostsByCategory);
router.route("/hashtag/:hashtag").get(getNewsPostsByHashtag);
router.route("/footertag/:footertag").get(getNewsPostsByFooterTag);
router.route("/search").get(searchNewsPosts);

// Route for incrementing views
router.route("/:id/views").post(trackArticleView);

// Type/ID route
router.route("/:type/:id").get(getNewsPostById);

// User-specific route
router.route("/user/:userId").get(protect, getNewsPostsByUser);

export default router;
