import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Connect to database
connectDB();

const devApp = express();
const devPort = process.env.DEVPORT || 8000;

devApp.use(express.json());
devApp.use(express.urlencoded({ extended: true }));
devApp.use(cookieParser());

devApp.use("/api/users", userRoutes);

devApp.get("/", (req, res) => {
  res.send("Development server is running....");
});

devApp.listen(devPort, () =>
  console.log(`\x1b[34mDevelopment server running on port ${devPort}\x1b[0m`)
);

// Error Middleware
devApp.use(notFound);
devApp.use(errorHandler);
