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
import fs from "fs"; // For reading/writing files
import * as cheerio from "cheerio";
import sanitizeHtml from "sanitize-html";
import News from "./models/NewsSchema.js"; // Import News model to fetch article data

// Connect to database
connectDB();

const port = process.env.PORT || 5000;
const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie Parser Middleware
app.use(cookieParser());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsPostRoute);
app.use("/api/videos", videoRoutes);

const __dirname = path.resolve();

// Function to modify HTML with article data
function modifyHtml(html, newsPost, requestPath) {
  const $ = cheerio.load(html);

  // Sanitize title and conclusion with explicit configuration
  const sanitizeOptions = {
    allowedTags: [], // Disallow all HTML tags
    allowedAttributes: {}, // Disallow all attributes
    textFilter: function (text) {
      return text.replace(/[\n\r]+/g, " ").trim(); // Remove newlines and extra spaces
    },
  };

  const sanitizedTitle = sanitizeHtml(
    newsPost.title || "The Lok Mangal News",
    sanitizeOptions
  );
  const sanitizedConclusion = sanitizeHtml(
    newsPost.conclusion || "Get Latest news updates",
    sanitizeOptions
  );

  // console.log(sanitizedTitle);
  // console.log(sanitizedConclusion);

  // Update title
  $("head title").text(sanitizedTitle);

  // Update Open Graph meta tags (for WhatsApp, Facebook, etc.)
  $('meta[property="og:title"]').attr(
    "content",
    `${sanitizedTitle} - The Lokmangal News`
  );
  $('meta[property="og:description"]').attr("content", sanitizedConclusion);
  $('meta[property="og:image"]').attr(
    "content",
    newsPost.imgUrl || "/image.png"
  );
  $('meta[property="og:url"]').attr(
    "content",
    `https://thelokmangal.com${requestPath}`
  );

  // Update Twitter meta tags (optional, for Twitter)
  $('meta[name="twitter:title"]').attr(
    "content",
    `${sanitizedTitle} - The Lokmangal News`
  );
  $('meta[name="twitter:description"]').attr("content", sanitizedConclusion);
  $('meta[name="twitter:image"]').attr(
    "content",
    newsPost.imgUrl || "/image.png"
  );

  // Update canonical link
  $('link[rel="canonical"]').attr(
    "href",
    `https://thelokmangal.com${requestPath}`
  );

  return $.html();
}

if (process.env.NODE_ENV === "production") {
  // Serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", async (req, res) => {
    // Get User-Agent to identify crawlers
    const userAgent = req.headers["user-agent"] || "";
    // Check if request is from a crawler (WhatsApp, Facebook, Twitter) or test query
    const isCrawler =
      /WhatsApp|FacebookExternalHit|Twitterbot/i.test(userAgent) ||
      req.query.crawler === "true";

    // Log all requests for debugging
    // console.log(
    //   `Request for ${req.path} | User-Agent: ${userAgent} | IsCrawler: ${isCrawler}`
    // );

    // console.log(req.path);
    // console.log("\n");

    if (isCrawler) {
      // Handle article URLs like /news/:type/:id
      const pathParts = req.path.split("/");
      // console.log("pathParts", pathParts);

      if (pathParts.length >= 3) {
        const type = pathParts[1];
        const id = pathParts[2];

        // console.log("type", type);
        // console.log("id", id);

        try {
          // Fetch article data from database
          const newsPost = await News.findOne({ _id: id, articleType: type });
          if (newsPost) {
            // console.log(`Article found: ${newsPost.title}`);

            // Read the original index.html
            const html = fs.readFileSync(
              path.resolve(__dirname, "frontend", "dist", "index.html"),
              "utf8"
            );

            const websitePath = `/${type}/${id}`;
            // Modify HTML with article data
            const modifiedHtml = modifyHtml(html, newsPost, websitePath);

            // console.log(newsPost);

            // Send modified HTML to crawler
            res.send(modifiedHtml);

            // For checking: Save modified HTML to a temporary file (optional)
            // fs.writeFileSync(
            //   path.resolve(__dirname, "backend", "modified-index.html"),
            //   modifiedHtml,
            //   "utf8"
            // );
            // console.log(
            //   "Modified index.html saved to backend/modified-index.html"
            // );
          } else {
            console.log(`Article not found for type: ${type}, id: ${id}`);
            // If article not found, send original index.html
            res.sendFile(
              path.resolve(__dirname, "frontend", "dist", "index.html")
            );
          }
        } catch (error) {
          console.error(`Error fetching article for ${req.path}:`, error);
          // On error, send original index.html
          res.sendFile(
            path.resolve(__dirname, "frontend", "dist", "index.html")
          );
        }
      } else {
        console.log("Path format invalid, sending original index.html");
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
      }
    } else {
      // For non-crawlers or non-article URLs, send original index.html
      console.log("Serving original index.html");
      res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    }
  });

  // Start server in production
  app.listen(port, "0.0.0.0", () =>
    console.log(
      `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
    )
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });

  // Start server in development
  app.listen(port, () =>
    console.log(
      `\x1b[34mServer running in ${process.env.NODE_ENV} mode on port ${port}\x1b[0m`
    )
  );
}

// Error Middleware
app.use(notFound);
app.use(errorHandler);
