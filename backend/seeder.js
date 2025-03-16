import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import colors from "colors";
import users from "./data/users.js";
// import newsPosts from "./data/newsPosts.js";
import generateMainNewsData from "./data/generateData.js";
import User from "./models/userModel.js";
import BreakingNews from "./models/BreakingNewsModel.js";
import LeftNews from "./models/newsLeftModel.js";
import RightNews from "./models/newsRightModel.js";
import GridNews from "./models/newsGridModel.js";
import MainNews from "./models/newsMainModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await BreakingNews.deleteMany();
    await LeftNews.deleteMany();
    await RightNews.deleteMany();
    await GridNews.deleteMany();
    await MainNews.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // Assuming first user is an admin

    console.log(colors.green("Importing NewsPost"));
    const sampleBreakingNews = generateMainNewsData(2).map((news) => {
      return {
        user: adminUser,
        ...news,
      };
    });
    const sampleLeftNewsPosts = generateMainNewsData(18).map((news) => {
      return {
        user: adminUser,
        ...news,
      };
    });
    const sampleRightNewsPosts = generateMainNewsData(12).map((news) => {
      return {
        user: adminUser,
        ...news,
      };
    });
    const sampleGridNewsPosts = generateMainNewsData(24).map((news) => {
      return {
        user: adminUser,
        ...news,
      };
    });
    const sampleMainNewsPosts = generateMainNewsData(20).map((news) => {
      return {
        user: adminUser,
        ...news,
      };
    });

    await BreakingNews.insertMany(sampleBreakingNews);
    await LeftNews.insertMany(sampleLeftNewsPosts);
    await RightNews.insertMany(sampleRightNewsPosts);
    await GridNews.insertMany(sampleGridNewsPosts);
    await MainNews.insertMany(sampleMainNewsPosts);

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
    await NewsPost.deleteMany();

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
