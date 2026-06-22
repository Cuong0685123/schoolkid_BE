import dotenv from "dotenv";
dotenv.config();

import { initDatabase } from "../models/index.js";
import app from "../app.js";

let initialized = false;

export default async function handler(req, res) {
  try {
    if (!initialized) {
      await initDatabase();
      initialized = true;
    }

    return app(req, res);
  } catch (error) {
    console.error("Vercel function error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}