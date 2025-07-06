import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

// Convert environment variables to numbers and provide defaults
const windowMs =
  (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 5) * 60 * 1000; // Default: 5 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 5; // Default: 5 requests

export const rateLimiter5by5 = rateLimit({
  windowMs, // Configurable window (default: 5 minutes)
  max: maxRequests, // Configurable max requests (default: 5)
  message: {
    message: "Too Many Requests Please Try Again After 5 Minutes",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
});
