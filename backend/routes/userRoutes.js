import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  deleteUser,
  getAllUsers,
  updateUser,
  getUserById,
  verifyToken,
  verifyAdmin,
} from "../controllers/userController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { rateLimiter5by5 } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", rateLimiter5by5, loginUser);
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyToken);
router.get("/verify-admin", protect, isAdmin, verifyAdmin);

router.route("/").post(protect, registerUser).get(protect, getAllUsers);

router
  .route("/:id")
  .put(protect, updateUser)
  .get(protect, getUserById)
  .delete(protect, deleteUser);

export default router;
