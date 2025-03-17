import asyncHandler from "../middleware/asyncHandler.js";
import BreakingNews from "../models/BreakingNewsModel.js";
import MainNews from "../models/newsMainModel.js";
import LeftNews from "../models/newsLeftModel.js";
import RightNews from "../models/newsRightModel.js";
import GridNews from "../models/newsGridModel.js";
import mongoose from "mongoose";
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
    LeftNews.find().sort({ createdAt: -1 }).limit(4),
    RightNews.find().sort({ createdAt: -1 }).limit(4),
    GridNews.find().sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({ breakingNews, main, left, right, grid });
});

export const getWeather = async (req, res) => {
  try {
    const { lat, lon, ip } = req.query;
    let weatherUrl;

    //  console.log("lat====================", lat);
    //  console.log("lon====================", lon);

    if (lat && lon) {
      weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`;
    } else if (ip) {
      // Use IP-based lookup as fallback
      const locationRes = await axios.get(`http://ip-api.com/json/${ip}`);
      const { lat: ipLat, lon: ipLon, countryCode } = locationRes.data;
      weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${ipLat},${ipLon}&aqi=yes`;
    } else {
      return res.status(400).json({ error: "Location data required" });
    }

    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    const processedData = {
      location: {
        name: weatherData.location.name,
        region: weatherData.location.region,
        country: weatherData.location.country,
        countryCode: weatherData.location.country_code, // WeatherAPI provides this
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

    console.log(processedData);
    res.status(200).json(processedData);
  } catch (error) {
    console.error("Weather API Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

// export const getWeather = async (req, res) => {
//   try {
//     // Get latitude and longitude from query parameters
//     const { lat, lon } = req.query;

//     // console.log("lat====================", lat);
//     // console.log("lon====================", lon);

//     // Construct the weather API URL
//     let weatherUrl;

//     if (lat && lon) {
//       // Use provided coordinates (from Navigator or IP)
//       weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`;
//     } else {
//       // No coordinates provided - this should not happen with updated frontend,
//       // but kept as a fallback just in case
//       return res.status(400).json({ error: "Location coordinates required" });
//     }

//     // Fetch weather data
//     const weatherResponse = await axios.get(weatherUrl);

//     // Process and extract relevant information
//     const weatherData = weatherResponse.data;

//     // Format the data for the frontend
//     const processedData = {
//       location: {
//         name: weatherData.location.name,
//         region: weatherData.location.region,
//         country: weatherData.location.country,
//         countryCode: weatherData.location.country,
//         // countryCode: getCountryCode(weatherData.location.country),
//         localtime: weatherData.location.localtime,
//       },
//       current: {
//         temp_c: weatherData.current.temp_c,
//         temp_f: weatherData.current.temp_f,
//         condition: weatherData.current.condition.text,
//         icon: weatherData.current.condition.icon,
//         humidity: weatherData.current.humidity,
//         wind_kph: weatherData.current.wind_kph,
//         wind_dir: weatherData.current.wind_dir,
//         feelslike_c: weatherData.current.feelslike_c,
//         uv: weatherData.current.uv,
//       },
//       air_quality: {
//         usEpaIndex: weatherData.current.air_quality["us-epa-index"],
//         pm2_5: weatherData.current.air_quality.pm2_5,
//         pm10: weatherData.current.air_quality.pm10,
//       },
//     };

//     // Send the processed data to the client
//     res.status(200).json(processedData);
//   } catch (error) {
//     console.error("Weather API Error:", error);
//     res.status(500).json({ error: "Failed to fetch weather data" });
//   }
// };

// export const getWeather = async (req, res) => {
//   try {
//     // Get latitude and longitude from query parameters
//     const { lat, lon } = req.query;

//     // If lat and lon are provided, use them
//     // Otherwise, use IP-based location as fallback
//     let weatherUrl;

//     if (lat && lon) {
//       weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${lat},${lon}&aqi=yes`;
//     } else {
//       // Fallback to IP-based location
//       const ipResponse = await axios.get("https://ipapi.co/json/");
//       const { latitude, longitude } = ipResponse.data;
//       weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}&aqi=yes`;
//     }

//     // Fetch weather data
//     const weatherResponse = await axios.get(weatherUrl);

//     // Process and extract relevant information
//     const weatherData = weatherResponse.data;

//     // Format the data for the frontend
//     const processedData = {
//       location: {
//         name: weatherData.location.name,
//         region: weatherData.location.region,
//         country: weatherData.location.country,
//         // countryCode: getCountryCode(weatherData.location.country),
//         countryCode: weatherData.location.country,
//         localtime: weatherData.location.localtime,
//       },
//       current: {
//         temp_c: weatherData.current.temp_c,
//         temp_f: weatherData.current.temp_f,
//         condition: weatherData.current.condition.text,
//         icon: weatherData.current.condition.icon,
//         humidity: weatherData.current.humidity,
//         wind_kph: weatherData.current.wind_kph,
//         wind_dir: weatherData.current.wind_dir,
//         feelslike_c: weatherData.current.feelslike_c,
//         uv: weatherData.current.uv,
//       },
//       air_quality: {
//         usEpaIndex: weatherData.current.air_quality["us-epa-index"],
//         pm2_5: weatherData.current.air_quality.pm2_5,
//         pm10: weatherData.current.air_quality.pm10,
//       },
//     };

//     // Send the processed data to the client
//     res.status(200).json(processedData);
//   } catch (error) {
//     console.error("Weather API Error:", error);
//     res.status(500).json({ error: "Failed to fetch weather data" });
//   }
// };

// const getAllNewsPosts = asyncHandler(async (req, res) => {
//   try {
//     // Get IP address from request
//     const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     console.log("ip============", ip);

//     // Get all news data (using your existing Promise.all approach)
//     const [breakingNews, main, left, right, grid] = await Promise.all([
//       BreakingNews.find().sort({ createdAt: -1 }).limit(1),
//       MainNews.find().sort({ createdAt: -1 }).limit(10),
//       LeftNews.find().sort({ createdAt: -1 }).limit(4),
//       RightNews.find().sort({ createdAt: -1 }).limit(4),
//       GridNews.find().sort({ createdAt: -1 }).limit(10),
//     ]);

//     // Add weather API calls to the same Promise.all
//     // First get location from IP
//     const locationResponse = await axios.get(`https://ipapi.co/${ip}/json/`);
//     const { latitude, longitude, city, country_name } = locationResponse.data;

//     // Then get weather using that location
//     const weatherResponse = await axios.get(
//       `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${latitude},${longitude}`
//     );

//     // Return everything together
//     res.json({
//       breakingNews,
//       main,
//       left,
//       right,
//       grid,
//       weather: {
//         location: {
//           city,
//           country: country_name,
//           latitude,
//           longitude,
//         },
//         data: weatherResponse.data,
//       },
//     });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// });

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
    breakingNews: BreakingNews,
    main: MainNews,
    left: LeftNews,
    right: RightNews,
    grid: GridNews,
  };

  // if (!models[type]) {
  //   res.status(400);
  //   throw new Error("Invalid news type");
  // }

  switch (key) {
    case value:
      break;

    default:
      break;
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
