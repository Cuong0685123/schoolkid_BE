import express from "express";
import { getAuthUrl, getToken } from "../services/googleDrive.service.js";

const router = express.Router();

// 1️⃣ Lấy URL để login Google
router.get("/auth", (req, res) => {
  const url = getAuthUrl();
  res.json({ url });
});

// 2️⃣ Google redirect về đây
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send("Missing ?code=");

  await getToken(code);
  res.send("Token saved successfully!");
});

export default router;
