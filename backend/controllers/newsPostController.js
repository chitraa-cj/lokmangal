import asyncHandler from "../middleware/asyncHandler.js";
import MainNews from "../models/newsMainModel.js";
import LeftNews from "../models/newsLeftModel.js";
import RightNews from "../models/newsRightModel.js";
import GridNews from "../models/newsGridModel.js";
import mongoose from "mongoose";

/**
 * @desc Get all news posts
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = asyncHandler(async (req, res) => {
  const [hero, left, right, grid] = await Promise.all([
    MainNews.find().sort({ createdAt: -1 }).limit(10),
    LeftNews.find().sort({ createdAt: -1 }).limit(6),
    RightNews.find().sort({ createdAt: -1 }).limit(6),
    GridNews.find().sort({ createdAt: -1 }).limit(6),
  ]);

  res.json({ hero, left, right, grid });
});

/**
 * @desc Get a news post by ID
 * @route GET /api/news/:id
 * @access Public
 */
const getNewsPostById = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const models = {
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  if (!models[type]) {
    res.status(400);
    throw new Error("Invalid news type");
  }

  const newsPost = await models[type].findById(id);
  if (newsPost) {
    res.json(newsPost);
  } else {
    res.status(404);
    throw new Error("News post not found");
  }
});

/**
 * @desc Create a news post
 * @route POST /api/news
 * @access Private/Admin
 */
const createNewsPost = asyncHandler(async (req, res) => {
  const {
    type,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  const models = {
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  if (!models[type]) {
    res.status(400);
    throw new Error("Invalid news type");
  }

  const newsPost = new models[type]({
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
    user: req.user._id,
  });

  const createdNewsPost = await newsPost.save();
  res.status(201).json(createdNewsPost);
});

// const createNewsPost = asyncHandler(async (req, res) => {
//   const newsPost = new NewsPost({
//     ...req.body, // Spread the request body into the new NewsPost
//     user: req.user._id, // Ensure the user ID is included
//   });

//   const createdNewsPost = await newsPost.save();
//   res.status(201).json(createdNewsPost);
// });

/**
 * @desc Update a news post
 * @route PUT /api/news/:id
 * @access Private/Admin
 */
const updateNewsPost = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const models = {
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  if (!models[type]) {
    res.status(400);
    throw new Error("Invalid news type");
  }

  const newsPost = await models[type].findById(id);
  if (newsPost) {
    Object.assign(newsPost, req.body);
    const updatedNewsPost = await newsPost.save();
    res.json(updatedNewsPost);
  } else {
    res.status(404);
    throw new Error("News post not found");
  }
});
/**
 * @desc Delete a news post
 * @route DELETE /api/news/:id
 * @access Private/Admin
 */
const deleteNewsPost = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const models = {
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  if (!models[type]) {
    res.status(400);
    throw new Error("Invalid news type");
  }

  const newsPost = await models[type].findById(id);
  if (newsPost) {
    await models[type].deleteOne({ _id: id });
    res.status(200).json({ message: "News post deleted successfully" });
  } else {
    res.status(404);
    throw new Error("News post not found");
  }
});

/**
 * @desc Get all news posts of a particular user
 * @route GET /api/news/user/:userId
 * @access Private
 */
const getNewsPostsByUser = asyncHandler(async (req, res) => {
  const newsPosts = await MainNews.find({ user: req.params.userId }).sort({
    createdAt: -1,
  });

  if (newsPosts.length > 0) {
    res.json(newsPosts);
  } else {
    res.status(404);
    throw new Error("No news posts found for this user");
  }
});

/**
 * @desc Get all news posts by category
 * @route GET /api/news/category/:category
 * @access Public
 */
const getNewsPostsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const newsPosts = await MainNews.find({
    navbarCategories: category,
  }).sort({
    createdAt: -1,
  });
  // console.log(newsPosts);

  if (newsPosts.length > 0) {
    res.json(newsPosts);
  } else {
    res.status(404);
    throw new Error("No news posts found for this category");
  }
});

export {
  getAllNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  getNewsPostsByUser,
  getNewsPostsByCategory,
};
