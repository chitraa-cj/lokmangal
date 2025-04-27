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
// import fs from "fs/promises";
// import News from "./models/NewsSchema.js";

// // Connect to database
// connectDB();

// const port = process.env.PORT || 5000;
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const __dirname = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   // Serve static frontend build files
//   app.use(express.static(path.join(__dirname, "frontend", "dist")));

//   // Handle /news/:type/:id route for dynamic metadata
//   app.get("/api/news/:type/:id", async (req, res, next) => {
//     const { type, id } = req.params;
//     try {
//       // Fetch article from MongoDB
//       const article = await News.findById(id);
//       if (!article) {
//         res.status(404);
//         throw new Error("Article not found");
//       }

//       // Read index.html
//       const indexPath = path.join(__dirname, "frontend", "dist", "index.html");
//       let html = await fs.readFile(indexPath, "utf-8");

//       // Define dynamic metadata
//       const articleUrl = `https://thelokmangal.com/news/${type}/${id}`;
//       const metaTags = `
//         <title>${article.title || "The Lok Mangal News"}</title>
//         <meta name="description" content="${
//           article.conclusion || "Read the latest news on The Lok Mangal News"
//         }">
//         <meta property="og:title" content="${
//           article.title || "The Lok Mangal News"
//         }">
//         <meta property="og:description" content="${
//           article.conclusion || "Read the latest news on The Lok Mangal News"
//         }">
//         <meta property="og:image" content="${article.imgUrl}">
//         <meta property="og:url" content="${articleUrl}">
//         <meta property="og:type" content="article">
//         <meta name="twitter:card" content="summary_large_image">
//         <meta name="twitter:title" content="${
//           article.title || "The Lok Mangal News"
//         }">
//         <meta name="twitter:description" content="${
//           article.conclusion || "Read the latest news on The Lok Mangal News"
//         }">
//         <meta name="twitter:image" content="${article.imgUrl}">
//       `;

//       // Replace the <head> section with dynamic metadata
//       html = html.replace(
//         /<head>[\s\S]*<\/head>/,
//         `<head>\n<meta charset="UTF-8" />\n<link rel="icon" type="image/svg+xml" href="/image.png" />\n<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n${metaTags}\n</head>`
//       );

//       // Send customized HTML
//       res.setHeader("Content-Type", "text/html");
//       res.send(html);
//     } catch (error) {
//       next(error);
//     }
//   });

//   // Mount API routes
//   app.use("/api/users", userRoutes);
//   app.use("/api/news", newsPostRoute);
//   app.use("/api/videos", videoRoutes);

//   // Fallback to index.html for other routes
//   app.get("*", (req, res) =>
//     res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
//   );

//   // Listen on all interfaces in production
//   app.listen(port, "0.0.0.0", () =>
//     console.log(
//       `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
//     )
//   );
// } else {
//   // Development mode
//   app.get("/", (req, res) => {
//     res.send("API is running....");
//   });

//   // Mount API routes
//   app.use("/api/users", userRoutes);
//   app.use("/api/news", newsPostRoute);
//   app.use("/api/videos", videoRoutes);

//   // Listen on localhost in development
//   app.listen(port, () =>
//     console.log(
//       `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
//     )
//   );
// }

// // Error middleware
// app.use(notFound);
// app.use(errorHandler);
