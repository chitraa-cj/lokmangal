import asyncHandler from "../middleware/asyncHandler.js";
import crypto from "crypto";
import mongoose from "mongoose";
import News from "../models/NewsSchema.js";
import Video from "../models/VideoModel.js";
import axios from "axios";

/**
 * @desc Get all news posts with videos
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = asyncHandler(async (req, res) => {
  const [breakingNews, main, left, right, grid, videos] = await Promise.all([
    News.find({ articleType: "breakingNews" }).sort({ createdAt: -1 }).limit(1),
    News.find({ articleType: "main" }).sort({ createdAt: -1 }).limit(10),
    News.find({ articleType: "left" }).sort({ createdAt: -1 }).limit(4),
    News.find({ articleType: "right" }).sort({ createdAt: -1 }).limit(4),
    News.find({ articleType: "grid" }).sort({ createdAt: -1 }).limit(12),
    Video.find(),
  ]);

  res.json({ breakingNews, main, left, right, grid, videos });
});

/**
 * @desc Get paginated main news posts
 * @route GET /api/news/main/paginated
 * @access Public
 */
const getPaginatedMainNewsPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
  const limit = 20; // Number of posts per page
  const skip = (page - 1) * limit;

  const mainPosts = await News.find({ articleType: "main" })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await News.countDocuments({ articleType: "main" });
  const hasMore = skip + mainPosts.length < totalPosts;

  res.json({
    mainPosts,
    page,
    hasMore,
    totalPages: Math.ceil(totalPosts / limit),
  });
});

/**
 * @desc Get all news posts
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPostsAdmin = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit =
    parseInt(req.query.limit) || process.env.PAGINATION_LIMIT || 100;
  const skip = (page - 1) * limit;

  const [news, total] = await Promise.all([
    News.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    News.countDocuments(),
  ]);

  const pagination = {
    currentPage: page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsOnPage: news.length,
  };

  res.json({
    posts: news,
    pagination,
    totalCounts: {
      breakingNews: await News.countDocuments({ articleType: "breakingNews" }),
      main: await News.countDocuments({ articleType: "main" }),
      left: await News.countDocuments({ articleType: "left" }),
      right: await News.countDocuments({ articleType: "right" }),
      grid: await News.countDocuments({ articleType: "grid" }),
      total,
    },
  });
});

const getWeather = async (req, res) => {
  try {
    const { lat, lon, ip } = req.query;
    let weatherUrl;

    if (lat && lon) {
      weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`;
    } else if (ip) {
      const locationRes = await axios.get(`http://ip-api.com/json/${ip}`);
      const { lat: ipLat, lon: ipLon } = locationRes.data;
      weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ipLat},${ipLon}&aqi=yes`;
    } else {
      return res.status(400).json({ error: "Location data required" });
    }

    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    // Optimize country code handling
    let countryCode;
    const countryName = weatherData.location.country.trim().toLowerCase();

    // If country is India, set code to "IN" directly
    if (countryName === "india" || countryName.includes("india")) {
      countryCode = "IN";
    } else {
      // For non-India countries, use Rest Countries API
      try {
        const countryRes = await axios.get(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(
            weatherData.location.country
          )}?fields=cca2`
        );
        if (countryRes.data && countryRes.data.length > 0) {
          countryCode = countryRes.data[0].cca2;
        } else {
          console.warn(
            `No country code found for: ${weatherData.location.country}`
          );
          countryCode = "IN"; // Fallback to India for unknown countries
        }
      } catch (error) {
        console.error(
          "Error fetching country code from Rest Countries API:",
          error.message
        );
        countryCode = "IN"; // Fallback to India if API fails
      }
    }

    const processedData = {
      location: {
        name: weatherData.location.name,
        region: weatherData.location.region,
        country: weatherData.location.country,
        countryCode: countryCode,
        localtime: weatherData.location.localtime,
      },
      current: {
        temp_c: weatherData.current.temp_c,
        temp_f: weatherData.current.temp_f,
        condition: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
        humidity: weatherData.current.humidity,
        wind_kph: weatherData.current.wind_kph,
        wind_dir: weatherData.current.wind_dir,
        feelslike_c: weatherData.current.feelslike_c,
        uv: weatherData.current.uv,
      },
      air_quality: {
        usEpaIndex: weatherData.current.air_quality["us-epa-index"],
        pm2_5: weatherData.current.air_quality.pm2_5,
        pm10: weatherData.current.air_quality.pm10,
      },
    };

    // Log for debugging (optional, can be removed in production)
    // console.log("Processed weather data:", {
    //   country: processedData.location.country,
    //   countryCode: processedData.location.countryCode,
    // });

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Weather API Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

/**
 * @desc Get a news post by ID
 * @route GET /api/news/:id
 * @access Public
 */
const getNewsPostById = async (req, res) => {
  try {
    const { type, id } = req.params;
    const newsPost = await News.findOne({ _id: id, articleType: type });

    if (!newsPost) {
      return res.status(404).json({ message: "News post not found" });
    }

    res.json(newsPost);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Create a news post
 * @route POST /api/news
 * @access Private/Admin
 */
const createNewsPost = asyncHandler(async (req, res) => {
  const {
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  // console.log(req.user);

  // Check if articleType is provided and valid
  const validTypes = ["breakingNews", "main", "left", "right", "grid"];
  if (!articleType || !validTypes.includes(articleType)) {
    res.status(400);
    throw new Error(
      `Invalid news type: ${articleType}. Must be one of: ${validTypes.join(
        ", "
      )}`
    );
  }

  // console.log(req.user.name);
  // Create new news post
  const newsPost = new News({
    user: req.user._id,
    userName: req.user.name,
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories: navbarCategories || "",
    hashtags: hashtags || [],
    footerTags: footerTags || "",
  });

  const createdNewsPost = await newsPost.save();
  res.status(201).json(createdNewsPost);
});

/**
 * @desc Update a news post
 * @route PUT /api/news/:id
 * @access Private/Admin
 */
const updateNewsPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  const newsPost = await News.findById(id);
  if (!newsPost) {
    res.status(404);
    throw new Error("News post not found");
  }

  // If articleType is provided, validate it
  if (articleType) {
    const validTypes = ["breakingNews", "main", "left", "right", "grid"];
    if (!validTypes.includes(articleType)) {
      res.status(400);
      throw new Error(
        `Invalid news type: ${articleType}. Must be one of: ${validTypes.join(
          ", "
        )}`
      );
    }
  }

  // Update fields only if provided in the request
  newsPost.articleType = articleType || newsPost.articleType;
  newsPost.title = title || newsPost.title;
  newsPost.conclusion = conclusion || newsPost.conclusion;
  newsPost.imgUrl = imgUrl || newsPost.imgUrl;
  newsPost.content = content || newsPost.content;
  newsPost.navbarCategories = navbarCategories || newsPost.navbarCategories;
  newsPost.hashtags = hashtags || newsPost.hashtags;
  newsPost.footerTags = footerTags || newsPost.footerTags;

  const updatedNewsPost = await newsPost.save();
  res.json(updatedNewsPost);
});

/**
 * @desc Delete a news post
 * @route DELETE /api/news/:id
 * @access Private/Admin
 */
const deleteNewsPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const newsPost = await News.findById(id);
  if (newsPost) {
    await News.deleteOne({ _id: id });
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
  const newsPosts = await News.find({ user: req.params.userId }).sort({
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // Query news posts with pagination
  const newsPosts = await News.find({
    navbarCategories: { $in: [category] },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get total count for pagination
  const totalPosts = await News.countDocuments({
    navbarCategories: { $in: [category] },
  });

  // Always return a response, even if no posts are found for this page
  res.json({
    posts: newsPosts || [], // Return empty array if no posts
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts: totalPosts,
  });
});

/**
 * @desc Get all news posts by hashtag
 * @route GET /api/news/hashtag/:hashtag
 * @access Public
 */
const getNewsPostsByHashtag = asyncHandler(async (req, res) => {
  const { hashtag } = req.params;
  // console.log("Requested hashtag:", hashtag);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // console.log("Pagination - Page:", page, "Limit:", limit, "Skip:", skip);

  try {
    const newsPosts = await News.find({
      hashtags: { $in: [hashtag] }, // Check if the hashtag exists in the array
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // console.log("Fetched posts:", newsPosts.length);

    const totalPosts = await News.countDocuments({
      hashtags: { $in: [hashtag] },
    });

    // console.log("Total matching posts:", totalPosts);

    res.json({
      posts: newsPosts || [],
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts: totalPosts,
    });
  } catch (error) {
    console.error("Error fetching news posts by hashtag:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// newsPostController.js
/**
 * @desc Get all news posts by footer tag
 * @route GET /api/news/footertag/:footertag
 * @access Public
 */
const getNewsPostsByFooterTag = asyncHandler(async (req, res) => {
  const { footertag } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const newsPosts = await News.find({
    footerTags: footertag,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await News.countDocuments({
    footerTags: footertag,
  });

  res.json({
    posts: newsPosts || [],
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts: totalPosts,
  });
});

/**
 * @desc Search news posts by query
 * @route GET /api/news/search
 * @access Public
 */
const searchNewsPosts = asyncHandler(async (req, res) => {
  // console.log("Raw req.query:", req.query);

  let { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  // console.log("Pagination params:", { page, limit, skip });
  // console.log("Search term (q):", q);

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  const newsPosts = await News.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { conclusion: { $regex: q, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await News.countDocuments({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { conclusion: { $regex: q, $options: "i" } },
    ],
  });

  // console.log("Total matching posts:", totalPosts);
  // console.log("Posts returned for this page:", newsPosts.length);

  res.json({
    posts: newsPosts || [],
    currentPage: page,
    totalPages: Math.ceil(totalPosts / limit),
    totalPosts: totalPosts,
  });
});

const getAllHashtags = asyncHandler(async (req, res) => {
  try {
    // Use aggregation to get unique hashtags
    const hashtags = await News.aggregate([
      // Unwind the hashtags array to process each hashtag individually
      { $unwind: "$hashtags" },
      // Group by hashtag to remove duplicates and sort them
      {
        $group: {
          _id: "$hashtags",
        },
      },
      // Project to reshape the output
      {
        $project: {
          hashtag: "$_id",
          _id: 0,
        },
      },
      // Sort alphabetically
      { $sort: { hashtag: 1 } },
      // Limit the number of hashtags (optional, adjust as needed)
      { $limit: 6 },
    ]);

    // Map the results to add # prefix if not already present
    const formattedHashtags = hashtags.map((item) => {
      const hashtag = item.hashtag;
      return hashtag.startsWith("#") ? hashtag : `#${hashtag}`;
    });

    // Remove any duplicates that might have slipped through (just in case)
    const uniqueHashtags = [...new Set(formattedHashtags)];

    res.json({
      success: true,
      hashtags: uniqueHashtags,
      count: uniqueHashtags.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hashtags",
      error: error.message,
    });
  }
});

const getClientIP = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress
  );
};

// Simple rate limiting per IP
const requestCounts = new Map(); // { ip: { count, lastReset } }

const trackArticleView = asyncHandler(async (req, res) => {
  const { id: articleId } = req.params;
  const clientIP = getClientIP(req);

  // Basic rate limiting: max 50 requests per IP per hour
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  let ipData = requestCounts.get(clientIP) || { count: 0, lastReset: now };

  if (now - ipData.lastReset > hourInMs) {
    ipData = { count: 0, lastReset: now };
  }

  if (ipData.count >= 50) {
    return res
      .status(429)
      .json({ success: false, message: "Too many requests" });
  }

  ipData.count += 1;
  requestCounts.set(clientIP, ipData);

  // Update article views
  const newsPost = await News.findByIdAndUpdate(
    articleId,
    { $inc: { views: 1 } },
    { new: true }
  );

  if (!newsPost) {
    return res
      .status(404)
      .json({ success: false, message: "Article not found" });
  }

  // Update totalViews in Video model (assuming one video per article for simplicity)
  await Video.updateOne(
    { type: "main" }, // Adjust this condition based on your logic
    { $inc: { totalViews: 1 } },
    { upsert: true } // Creates if doesn't exist
  );

  res.status(200).json({ success: true, message: "View tracked" });
});

const getTotalArticleViews = asyncHandler(async (req, res) => {
  const totalViews = await Video.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$totalViews" },
      },
    },
  ]);

  const viewsCount = totalViews.length > 0 ? totalViews[0].total : 0;

  res.status(200).json({
    success: true,
    totalViews: viewsCount,
  });
});

export {
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
};

// const migrateNews = async () => {
//   const BreakingNews = mongoose.model("BreakingNews");
//   const MainNews = mongoose.model("MainNews");
//   const LeftNews = mongoose.model("LeftNews");
//   const RightNews = mongoose.model("RightNews");
//   const GridNews = mongoose.model("GridNews");

//   const collections = [
//     { model: BreakingNews, type: "breakingNews" },
//     { model: MainNews, type: "main" },
//     { model: LeftNews, type: "left" },
//     { model: RightNews, type: "right" },
//     { model: GridNews, type: "grid" },
//   ];

//   for (const { model, type } of collections) {
//     const items = await model.find().lean();
//     const updatedItems = items.map((item) => ({
//       ...item,
//       articleType: type,
//       navbarCategories: item.navbarCategories || [],
//       hashtags: item.hashtags || [],
//       footerTags: item.footerTags || [],
//     }));
//     await News.insertMany(updatedItems);
//     console.log(`Migrated ${type}: ${updatedItems.length} items`);
//   }
// };
