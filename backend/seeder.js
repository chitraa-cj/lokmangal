import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import colors from "colors";
import users from "./data/users.js";
import generateMainNewsData from "./data/generateData.js";
import OldData from "./data/news.js";
import User from "./models/userModel.js";
import Video from "./models/VideoModel.js";
import News from "./models/NewsSchema.js"; // Import the unified News model
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await News.deleteMany();
    await Video.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0];

    console.log(colors.green("Importing News Posts"));

    const oldDataMapped = OldData.map((news) => ({
      user: adminUser._id,
      // userName: adminUser.name,
      // articleType: "main",
      ...news,
    }));

    // Generate news data for each category with articleType
    // const sampleBreakingNews = generateMainNewsData(40).map((news) => ({
    //   user: adminUser._id,
    //   userName: adminUser.name,
    //   articleType: "breakingNews",
    //   ...news,
    // }));

    // const sampleLeftNews = generateMainNewsData(40).map((news) => ({
    //   user: adminUser._id,
    //   userName: adminUser.name,
    //   articleType: "left",
    //   ...news,
    // }));

    // const sampleRightNews = generateMainNewsData(40).map((news) => ({
    //   user: adminUser._id,
    //   userName: adminUser.name,
    //   articleType: "right",
    //   ...news,
    // }));

    // const sampleGridNews = generateMainNewsData(60).map((news) => ({
    //   user: adminUser._id,
    //   userName: adminUser.name,
    //   articleType: "grid",
    //   ...news,
    // }));

    // const sampleMainNews = generateMainNewsData(80).map((news) => ({
    //   user: adminUser._id,
    //   userName: adminUser.name,
    //   articleType: "main",
    //   ...news,
    // }));

    // Combine all news into one array
    // const allNews = [
    //   ...sampleBreakingNews,
    //   ...sampleLeftNews,
    //   ...sampleRightNews,
    //   ...sampleGridNews,
    //   ...sampleMainNews,
    // ];

    // Insert all news into the News collection
    // await News.insertMany(allNews);
    await News.insertMany(oldDataMapped);

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
    await Video.deleteMany();

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
