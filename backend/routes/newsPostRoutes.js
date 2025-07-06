import express from "express";
import {
  getAllNewsPosts,
  getPaginatedMainNewsPosts,
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
  trackArticleView,
  getTotalArticleViews,
} from "../controllers/newsPostController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { rateLimiter5by5 } from "../middleware/rateLimiter.js";

const router = express.Router();

// General routes
router
  .route("/")
  .get(getAllNewsPosts)
  .post(protect, rateLimiter5by5, createNewsPost);
router.route("/main/paginated").get(getPaginatedMainNewsPosts);
router.route("/weather").get(rateLimiter5by5, getWeather);
router.route("/hashtags").get(getAllHashtags);
router.route("/all").get(protect, getAllNewsPostsAdmin);

// ID-based routes
router
  .route("/:id")
  .put(protect, updateNewsPost)
  .delete(protect, deleteNewsPost);

router.route("/category/:category").get(getNewsPostsByCategory);
router.route("/hashtag/:hashtag").get(getNewsPostsByHashtag);
router.route("/footertag/:footertag").get(getNewsPostsByFooterTag);
router.route("/search").get(searchNewsPosts);

// View tracking and total views
router.route("/:id/views").post(trackArticleView);
router.route("/total-views").get(protect, getTotalArticleViews);

// Type/ID route
router.route("/:type/:id").get(getNewsPostById);

// User-specific route
router.route("/user/:userId").get(protect, getNewsPostsByUser);

export default router;
