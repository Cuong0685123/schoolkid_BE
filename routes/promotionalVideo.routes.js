// routes/promotionalVideo.routes.js
import express from "express";
import { promotionalVideoController } from "../controllers/promotionalVideo.controller.js";
import { getAuthUrl, getToken } from "../services/googleDrive.service.js";

const router = express.Router();

// B1: Lấy URL Google OAuth
router.get("/auth", (req, res) => {
  return res.json({ authUrl: getAuthUrl() });
});

// B2: Google redirect trả lại code
router.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Missing OAuth code");

  try {
    await getToken(code);
    res.send("Google OAuth thành công! Token đã lưu.");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// B3: Upload video + thumbnail
router.post(
  "/upload",
  promotionalVideoController.uploadMiddleware,
  promotionalVideoController.create
);

export default router;
