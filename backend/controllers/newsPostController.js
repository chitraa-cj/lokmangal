import asyncHandler from "../middleware/asyncHandler.js";
import NewsPost from "../models/newsPostModel.js";
import mongoose from "mongoose";

/**
 * @desc Get all news posts
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = asyncHandler(async (req, res) => {
  const newsPosts = await NewsPost.find().sort({ createdAt: -1 });
  res.json(newsPosts);
});

/**
 * @desc Get a news post by ID
 * @route GET /api/news/:id
 * @access Public
 */
const getNewsPostById = asyncHandler(async (req, res) => {
  const newsPost = await NewsPost.findById(req.params.id);

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
    title,
    conclusion,
    imgUrl,
    content,
    articleType,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  const newsPost = new NewsPost({
    title,
    conclusion,
    imgUrl,
    content,
    articleType,
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
  const {
    title,
    conclusion,
    imgUrl,
    content,
    articleType,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  const newsPost = await NewsPost.findById(req.params.id);

  if (newsPost) {
    newsPost.title = title !== undefined ? title : newsPost.title;
    newsPost.conclusion =
      conclusion !== undefined ? conclusion : newsPost.conclusion;
    newsPost.imgUrl = imgUrl !== undefined ? imgUrl : newsPost.imgUrl;
    newsPost.content = content !== undefined ? content : newsPost.content;
    newsPost.articleType =
      articleType !== undefined ? articleType : newsPost.articleType;
    newsPost.navbarCategories =
      navbarCategories !== undefined
        ? navbarCategories
        : newsPost.navbarCategories;
    newsPost.hashtags = hashtags !== undefined ? hashtags : newsPost.hashtags;
    newsPost.footerTags =
      footerTags !== undefined ? footerTags : newsPost.footerTags;

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
  const newsPost = await NewsPost.findById(req.params.id);

  if (newsPost) {
    await NewsPost.deleteOne({ _id: newsPost._id });
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
  const newsPosts = await NewsPost.find({ user: req.params.userId }).sort({
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
  const newsPosts = await NewsPost.find({
    navbarCategories: category,
    articleType: "main",
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
