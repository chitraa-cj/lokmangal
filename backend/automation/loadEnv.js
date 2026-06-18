// Side-effect module: load .env BEFORE any config is read.
// Imported first by config.js so process.env is populated regardless of
// ES-module import hoisting order.
import dotenv from "dotenv";
dotenv.config();
