// controllers/promotionalVideo.controller.js
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadFile } from "../services/googleDrive.service.js";
import { models } from "../models/index.js";

// Dùng folder tmp để chứa file tạm
const upload = multer({ dest: "tmp/" });

export const promotionalVideoController = {
  // Middleware upload 2 file: video + thumbnail
  uploadMiddleware: upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
  ]),

  // Xử lý upload
  create: async (req, res) => {
    try {
      const { title } = req.body;

      if (!req.files.videoFile || !req.files.thumbnailFile) {
        return res.status(400).json({ message: "Thiếu file upload" });
      }

      const videoFile = req.files.videoFile[0];
      const thumbFile = req.files.thumbnailFile[0];

      // Upload VIDEO lên Google Drive
      const videoUploaded = await uploadFile(
        videoFile.path,
        videoFile.mimetype,
        videoFile.originalname
      );

      // Upload THUMBNAIL lên Google Drive
      const thumbUploaded = await uploadFile(
        thumbFile.path,
        thumbFile.mimetype,
        thumbFile.originalname
      );

      // Lưu DB
      const record = await models.PromotionalVideo.create({
        title,
        video_url: videoUploaded.webViewLink,
        thumbnail_image_url: thumbUploaded.webViewLink,
      });

      // Xóa file tạm
      fs.unlinkSync(videoFile.path);
      fs.unlinkSync(thumbFile.path);

      res.json({
        message: "Upload thành công",
        record,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
};
