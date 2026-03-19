import multer from "multer";
import fs from "fs";
import {
  uploadFile,
  deleteFile,
  extractFileId,
} from "../services/googleDrive.service.js";
import { models } from "../models/index.js";

const upload = multer({ dest: "tmp/" });

export const promotionalVideoController = {
  uploadMiddleware: upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnailFile", maxCount: 1 },
  ]),

  // CREATE
  create: async (req, res) => {
    try {
      const { title } = req.body;

      if (!req.files?.videoFile || !req.files?.thumbnailFile) {
        return res.status(400).json({ message: "Thiếu file upload" });
      }

      const videoFile = req.files.videoFile[0];
      const thumbFile = req.files.thumbnailFile[0];

      const videoUploaded = await uploadFile(
        videoFile.path,
        videoFile.mimetype,
        videoFile.originalname
      );

      const thumbUploaded = await uploadFile(
        thumbFile.path,
        thumbFile.mimetype,
        thumbFile.originalname
      );

      const record = await models.PromotionalVideo.create({
        title,
        video_url: videoUploaded.url,
        thumbnail_image_url: thumbUploaded.url,
      });

      fs.unlinkSync(videoFile.path);
      fs.unlinkSync(thumbFile.path);

      res.json({ message: "Upload thành công", record });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET ALL
  getAll: async (req, res) => {
    try {
      const data = await models.PromotionalVideo.findAll({
        order: [["id", "DESC"]],
      });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET BY ID
  getById: async (req, res) => {
    try {
      const video = await models.PromotionalVideo.findByPk(req.params.id);

      if (!video) {
        return res.status(404).json({ message: "Không tìm thấy" });
      }

      res.json(video);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // UPDATE
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      const video = await models.PromotionalVideo.findByPk(id);

      if (!video) {
        return res.status(404).json({ message: "Không tìm thấy" });
      }

      let videoUrl = video.video_url;
      let thumbUrl = video.thumbnail_image_url;

      // update video
      if (req.files?.videoFile) {
        const file = req.files.videoFile[0];

        // // ❌ xóa file cũ
        // const oldId = extractFileId(video.video_url);
        // if (oldId) await deleteFile(oldId);

        const uploaded = await uploadFile(
          file.path,
          file.mimetype,
          file.originalname
        );

        videoUrl = uploaded.url;
        fs.unlinkSync(file.path);
      }

      // update thumbnail
      if (req.files?.thumbnailFile) {
        const file = req.files.thumbnailFile[0];

        const oldId = extractFileId(video.thumbnail_image_url);
        if (oldId) await deleteFile(oldId);

        const uploaded = await uploadFile(
          file.path,
          file.mimetype,
          file.originalname
        );

        thumbUrl = uploaded.url;
        fs.unlinkSync(file.path);
      }

      await video.update({
        title: title || video.title,
        video_url: videoUrl,
        thumbnail_image_url: thumbUrl,
      });

      res.json({ message: "Update thành công", video });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // DELETE (🔥 thêm luôn cho bạn)
  delete: async (req, res) => {
    try {
      const video = await models.PromotionalVideo.findByPk(req.params.id);

      if (!video) {
        return res.status(404).json({ message: "Không tìm thấy" });
      }

      const videoId = extractFileId(video.video_url);
      const thumbId = extractFileId(video.thumbnail_image_url);

      if (videoId) await deleteFile(videoId);
      if (thumbId) await deleteFile(thumbId);

      await video.destroy();

      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};