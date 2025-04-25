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

const router = express.Router();

// General routes
router.route("/").get(getAllNewsPosts).post(protect, createNewsPost);
router.route("/main/paginated").get(getPaginatedMainNewsPosts);
router.route("/weather").get(getWeather);
router.route("/hashtags").get(getAllHashtags);
router.route("/all").get(getAllNewsPostsAdmin);

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
// router.route("/:type/:id").get(getNewsPostById);
router.get(
  "/:type/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(`[API] Fetching article: id=${id}`);
    const article = await News.findById(id);
    if (article) {
      res.json(article);
    } else {
      res.status(404);
      throw new Error("Article not found");
    }
  })
);

// User-specific route
router.route("/user/:userId").get(protect, getNewsPostsByUser);

export default router;
