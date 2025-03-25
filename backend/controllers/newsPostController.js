import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";
import News from "../models/NewsSchema.js";
import axios from "axios";

/**
 * @desc Get all news posts
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = asyncHandler(async (req, res) => {
  const [breakingNews, main, left, right, grid] = await Promise.all([
    News.find({ articleType: "breakingNews" }).sort({ createdAt: -1 }).limit(1),
    News.find({ articleType: "main" }).sort({ createdAt: -1 }).limit(10),
    News.find({ articleType: "left" }).sort({ createdAt: -1 }).limit(5),
    News.find({ articleType: "right" }).sort({ createdAt: -1 }).limit(4),
    News.find({ articleType: "grid" }).sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({ breakingNews, main, left, right, grid });
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

  // Group by articleType for response
  const responseData = {
    breakingNews: news.filter((item) => item.articleType === "breakingNews"),
    main: news.filter((item) => item.articleType === "main"),
    left: news.filter((item) => item.articleType === "left"),
    right: news.filter((item) => item.articleType === "right"),
    grid: news.filter((item) => item.articleType === "grid"),
  };

  const pagination = {
    currentPage: page,
    limit,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    itemsOnPage: news.length,
  };

  res.json({
    ...responseData,
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

    // Get country code from country name using rest countries API
    let countryCode;
    try {
      const countryRes = await axios.get(
        `https://restcountries.com/v3.1/name/${weatherData.location.country}?fields=cca2`
      );
      countryCode = countryRes.data[0]?.cca2 || "US"; // Default to 'US' if lookup fails
    } catch (error) {
      console.error("Error fetching country code:", error);
      countryCode = "US"; // Fallback
    }

    const processedData = {
      location: {
        name: weatherData.location.name,
        region: weatherData.location.region,
        country: weatherData.location.country,
        countryCode: countryCode, // Use the fetched country code
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
        // uv: 5,
      },
      air_quality: {
        usEpaIndex: weatherData.current.air_quality["us-epa-index"],
        pm2_5: weatherData.current.air_quality.pm2_5,
        pm10: weatherData.current.air_quality.pm10,
      },
    };

    // console.log(processedData);
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
const getNewsPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const newsPost = await News.findById(id);
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
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

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

  // Create new news post
  const newsPost = new News({
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories: navbarCategories || [],
    hashtags: hashtags || [],
    footerTags: footerTags || [],
    user: req.user._id,
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

export {
  getAllNewsPosts,
  getNewsPostById,
  createNewsPost,
  updateNewsPost,
  deleteNewsPost,
  getNewsPostsByUser,
  getNewsPostsByCategory,
  getWeather,
  getAllNewsPostsAdmin,
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
