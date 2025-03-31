import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import newsPostRoute from "./routes/newsPostRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Connect to database
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/news", newsPostRoute);
app.use("/api/videos", videoRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Serve frontend build files if in production
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );

  // In production, listen on all interfaces
  app.listen(port, "0.0.0.0", () =>
    console.log(
      `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });

  // In development, only listen on localhost
  app.listen(port, () =>
    console.log(
      `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
    )
  );
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);
