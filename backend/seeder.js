import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import colors from "colors";
import users from "./data/users.js";
import newsPosts from "./data/newsPosts.js";
import User from "./models/userModel.js";
import NewsPost from "./models/newsPostModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await NewsPost.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id; // Assuming first user is an admin

    const sampleNewsPosts = newsPosts.map((news) => ({
      ...news,
      user: adminUser,
    }));

    await NewsPost.insertMany(sampleNewsPosts);

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
