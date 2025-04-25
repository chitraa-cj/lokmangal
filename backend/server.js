// import path from "path";
// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// import connectDB from "./config/db.js";
// import cookieParser from "cookie-parser";
// import userRoutes from "./routes/userRoutes.js";
// import newsPostRoute from "./routes/newsPostRoutes.js";
// import videoRoutes from "./routes/videoRoutes.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// // Connect to database
// connectDB();

// const port = process.env.PORT || 5000;
// const app = express();

// // Body Parser Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Cookie Parser Middleware
// app.use(cookieParser());

// app.use("/api/users", userRoutes);
// app.use("/api/news", newsPostRoute);
// app.use("/api/videos", videoRoutes);

// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   // Serve frontend build files if in production
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
//   );

//   // In production, listen on all interfaces
//   app.listen(port, "0.0.0.0", () =>
//     console.log(
//       `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
//     )
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });

//   // In development, only listen on localhost
//   app.listen(port, () =>
//     console.log(
//       `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
//     )
//   );
// }

// // Error Middleware
// app.use(notFound);
// app.use(errorHandler);

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
import fs from "fs/promises"; // For reading article.html
import News from "./models/NewsSchema.js"; // Adjust path to your News model

// Connect to database
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  // Serve frontend build files
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // Handle /api/news/:type/:id route for serving article.html
  app.get("/api/news/:type/:id", async (req, res, next) => {
    const { type, id } = req.params;
    try {
      // Fetch article data directly from MongoDB
      const article = await News.findById(id);
      if (!article) {
        res.status(404);
        throw new Error("Article not found");
      }

      // Read article.html template
      const templatePath = path.join(
        __dirname,
        "frontend",
        "dist",
        "article.html"
      );
      let html = await fs.readFile(templatePath, "utf-8");

      // Replace placeholders with article data
      const articleUrl = `https://thelokmangal.com/api/news/${type}/${id}`; // Adjust to your production domain
      html = html
        .replace(/{{TITLE}}/g, article.title || "The Lok Mangal News")
        .replace(
          /{{DESCRIPTION}}/g,
          article.conclusion || "Read the latest news on The Lok Mangal News"
        )
        .replace(/{{IMAGE_URL}}/g, article.imgUrl) // Use Cloudinary URL directly
        .replace(/{{ARTICLE_URL}}/g, articleUrl);
      console.log("log");
      // Send customized HTML
      res.setHeader("Content-Type", "text/html");
      res.send(html);
    } catch (error) {
      next(error); // Pass to error middleware
    }
  });

  // Mount API routes (after custom route to avoid conflict)
  app.use("/api/users", userRoutes);
  app.use("/api/news", newsPostRoute);
  app.use("/api/videos", videoRoutes);

  // Fallback to index.html for other routes
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

  // Mount API routes in development
  app.use("/api/users", userRoutes);
  app.use("/api/news", newsPostRoute);
  app.use("/api/videos", videoRoutes);

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
