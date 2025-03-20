import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import colors from "colors";
import users from "./data/users.js";
import generateMainNewsData from "./data/generateData.js";
import User from "./models/userModel.js";
import News from "./models/NewsSchema.js"; // Import the unified News model
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await News.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // Assuming first user is an admin

    console.log(colors.green("Importing News Posts"));

    // Generate news data for each category with articleType
    const sampleBreakingNews = generateMainNewsData(40).map((news) => ({
      user: adminUser,
      articleType: "breakingNews",
      ...news,
      navbarCategories: [], // BreakingNews doesn't use these fields
      hashtags: [],
      footerTags: [],
    }));

    const sampleLeftNews = generateMainNewsData(40).map((news) => ({
      user: adminUser,
      articleType: "left",
      ...news,
      navbarCategories: [], // LeftNews doesn't use these fields
      hashtags: [],
      footerTags: [],
    }));

    const sampleRightNews = generateMainNewsData(40).map((news) => ({
      user: adminUser,
      articleType: "right",
      ...news,
      navbarCategories: [], // RightNews doesn't use these fields
      hashtags: [],
      footerTags: [],
    }));

    const sampleGridNews = generateMainNewsData(60).map((news) => ({
      user: adminUser,
      articleType: "grid",
      ...news,
      navbarCategories: [], // GridNews doesn't use these fields
      hashtags: [],
      footerTags: [],
    }));

    const sampleMainNews = generateMainNewsData(80).map((news) => ({
      user: adminUser,
      articleType: "main",
      ...news, // navbarCategories, hashtags, footerTags are included from generateMainNewsData
    }));

    // Combine all news into one array
    const allNews = [
      ...sampleBreakingNews,
      ...sampleLeftNews,
      ...sampleRightNews,
      ...sampleGridNews,
      ...sampleMainNews,
    ];

    // Insert all news into the News collection
    await News.insertMany(allNews);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await News.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
