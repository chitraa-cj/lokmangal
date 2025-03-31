import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

/**
 * @desc    Auth User & Get Token
 * @route   POST /api/users/login
 * @access  Private
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // console.log("Login attempt:", { username });

  const user = await User.findOne({ username });
  // console.log("User found:", !!user);

  if (user) {
    const isMatch = await user.matchPassword(password);
    // console.log("Password match result:", isMatch);

    if (isMatch) {
      generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        isAuthenticated: true,
      });
    } else {
      // console.log("Password doesn't match");
      res.status(401);
      throw new Error("Invalid username or password");
    }
  } else {
    // console.log("User not found");
    res.status(401);
    throw new Error("Invalid username or password");
  }
});

/**
 * @desc    Logout User / Clear Cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
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
