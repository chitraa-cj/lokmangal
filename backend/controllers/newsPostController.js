import asyncHandler from "../middleware/asyncHandler.js";
import BreakingNews from "../models/BreakingNewsModel.js";
import MainNews from "../models/newsMainModel.js";
import LeftNews from "../models/newsLeftModel.js";
import RightNews from "../models/newsRightModel.js";
import GridNews from "../models/newsGridModel.js";
import mongoose, { model } from "mongoose";
import axios from "axios";

/**
 * @desc Get all news posts
 * @route GET /api/news
 * @access Public
 */
const getAllNewsPosts = asyncHandler(async (req, res) => {
  const [breakingNews, main, left, right, grid] = await Promise.all([
    BreakingNews.find().sort({ createdAt: -1 }).limit(1),
    MainNews.find().sort({ createdAt: -1 }).limit(10),
    LeftNews.find().sort({ createdAt: -1 }).limit(5),
    RightNews.find().sort({ createdAt: -1 }).limit(4),
    GridNews.find().sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({ breakingNews, main, left, right, grid });
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
    articleType,
    title,
    conclusion,
    imgUrl,
    content,
    navbarCategories,
    hashtags,
    footerTags,
  } = req.body;

  // Check if articleType is provided
  if (!articleType) {
    res.status(400);
    throw new Error("News article type is required");
  }

  const models = {
    breakingNews: BreakingNews,
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  // Log the request body for debugging (optional, can be removed later)
  // console.log("Request body:", req.body);
  // console.log("Received type:", articleType);
  // console.log("Available models:", Object.keys(models));
  // console.log("===========", models[articleType]);

  // Check if the articleType exists in models object
  if (!models[articleType]) {
    res.status(400);
    throw new Error(
      `Invalid news type: ${articleType}. Must be one of: ${Object.keys(
        models
      ).join(", ")}`
    );
  }

  // Create new news post with the appropriate model
  const newsPost = new models[articleType]({
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
  getWeather,
};
