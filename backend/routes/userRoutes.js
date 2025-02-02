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

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/verify", protect, verifyToken);
router.get("/verify-admin", protect, isAdmin, verifyAdmin);

router
  .route("/")
  .post(protect, isAdmin, registerUser)
  .get(protect, isAdmin, getAllUsers);

router
  .route("/:id")
  .put(protect, isAdmin, updateUser)
  .get(protect, isAdmin, getUserById)
  .delete(protect, isAdmin, deleteUser);

export default router;
