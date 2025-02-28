import express from "express";
import {
  getAllNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  getNewsPostsByUser,
  getNewsPostsByCategory,
} from "../controllers/newsPostController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getAllNewsPosts).post(protect, isAdmin, createNewsPost);
router
  .route("/:id")
  .put(protect, isAdmin, updateNewsPost)
  .delete(protect, isAdmin, deleteNewsPost);

router.route("/user/:userId").get(protect, getNewsPostsByUser);

router.route("/:type/:id").get(getNewsPostById);

router.route("/category/:category").get(getNewsPostsByCategory);

export default router;
