import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Auth User & Get Token
 * @route   POST /api/users/login
 * @access  Private
 */
// This logout version will terminate the previous session and create a new one
export const loginUser = asyncHandler(async (req, res) => {
  const expirationDate = new Date("2026-01-10");
  const currentDate = new Date();

  if (currentDate > expirationDate) {
    res
      .status(403)
      .json({ message: "Subscription expired. Please contact support." });
  } else {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      // Generate new token with 1 day expiry
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "24h", // Changed from 30d to 24h
      });

      // Update user's active session
      user.activeSession = {
        token,
        lastActive: new Date(),
      };
      await user.save();

      // Set cookie with 1 day expiry
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      });

      res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        isAuthenticated: true,
      });
    } else {
      res.status(401);
      throw new Error("Invalid username or password");
    }
  }
});

// This login version won't allow the user to create a new session if there is was a session created before but wasn't logged out and also allowing the programmer to not let the user create a new session
// const loginUser = asyncHandler(async (req, res) => {
//   const { username, password } = req.body;

//   const user = await User.findOne({ username });

//   if (user && (await user.matchPassword(password))) {
//     // Check for existing active session
//     if (user.activeSession && user.activeSession.lastActive) {
//       // Calculate time since last activity
//       const timeSinceLastActive = Date.now() - user.activeSession.lastActive;
//       const oneDayInMs = 24 * 60 * 60 * 1000;

//       // If session is less than 24 hours old, reject the login
//       if (timeSinceLastActive < oneDayInMs) {
//         res.status(403);
//         throw new Error(
//           "Another session is already active. Please try again later."
//         );
//       }
//     }

//     // If no active session or session expired, proceed with login
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "24h",
//     });

//     // Update user's active session
//     user.activeSession = {
//       token,
//       lastActive: new Date(),
//     };
//     await user.save();

//     // Set cookie
//     res.cookie("jwt", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       username: user.username,
//       isAdmin: user.isAdmin,
//       isAuthenticated: true,
//     });
//   } else {
//     res.status(401);
//     throw new Error("Invalid username or password");
//   }
// });

/**
 * @desc    Logout User / Clear Cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear active session in database
  const user = await User.findById(req.user._id);
  if (user) {
    user.activeSession = null;
    await user.save();
  }

  // Clear cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged Out Successfully" });
});

/**
 * @desc    Register User
 * @route   POST /api/users/
 * @access  Private / Admin
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password } = req.body;

  // Count total users
  const userCount = await User.countDocuments();

  // Check if user limit reached (7 users)
  if (userCount >= 7) {
    res.status(400);
    throw new Error("Maximum user limit reached (5 users)");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    username,
    password,
  });

  if (user) {
    //claude.ai/chat/af787142-daa4-43ba-8e6f-9217ee4ba93c
    // generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

/**
 * @desc    Delete User
 * @route   DELETE /api/users/:id
 * @access  Private / Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400).json({ message: "Cannot delete admin user" });
      throw new Error("Cannot delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({
      message: "User deleted successfully",
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    GET All Users
 * @route   GET /api/users/
 * @access  Private / Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    if (!users) {
      res.status(404);
      throw new Error("No users found");
    }

    res.json(users);
  } catch (error) {
    res.status(500);
    throw new Error(`Error fetching users: ${error.message}`);
  }
});

/**
 * @desc    Update User
 * @route   PUT /api/users/:id
 * @access  Private / Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  // console.log(user);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Get User by ID
 * @route   GET /api/users/:id
 * @access  Private / Admin
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/**
 * @desc    Verify Token
 * @route   GET /api/users/verify
 * @access  Private
 */
export const verifyToken = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }

    res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(401);
    throw new Error("Authentication failed");
  }
});

/**
 * @desc    Verify if User is Admin
 * @route   GET /api/users/verify-admin
 * @access  Private / Admin
 */
export const verifyAdmin = asyncHandler(async (req, res) => {
  // Since we're using the protect and isAdmin middleware,
  // we can be sure that req.user exists and is an admin
  res.status(200).json({
    isAuthenticated: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      isAdmin: req.user.isAdmin,
    },
  });
});
