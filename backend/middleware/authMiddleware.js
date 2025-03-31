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
      res.status(404);
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized, Token Failed");
  }
});

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as Admin");
  }
};

export { protect, isAdmin };
