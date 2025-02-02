import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, No Token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    // Verify if token matches active session
    if (!user.activeSession || user.activeSession.token !== token) {
      res.status(401);
      throw new Error("Session expired or invalidated");
    }

    // Update last active timestamp
    user.activeSession.lastActive = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid Token");
    } else if (error.name === "TokenExpiredError") {
      throw new Error("Token Expired");
    } else {
      throw new Error(error.message || "Not Authorized");
    }
  }
});

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as Admin");
  }
};

export { protect, isAdmin };
