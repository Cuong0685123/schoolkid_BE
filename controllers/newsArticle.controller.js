import multer from "multer";
import { newsArticleService } from "../services/newsArticle.service.js";
import {
  uploadFile,
  deleteFile,
  extractFileId,
} from "../services/googleDrive.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

export const newsArticleController = {
  uploadMiddleware: upload.single("thumbnailFile"),

  create: async (req, res) => {
    try {
      const payload = { ...req.body };

      if (req.file) {
        const uploaded = await uploadFile(
          req.file.buffer,
          req.file.mimetype,
          req.file.originalname
        );

        payload.thumbnail_url = uploaded.url;
      }

      const article = await newsArticleService.create(payload);

      res.json({ message: "Tạo bài viết thành công", article });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    const data = await newsArticleService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const data = await newsArticleService.getById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.json(data);
  },

  update: async (req, res) => {
    try {
      const oldArticle = await newsArticleService.getById(req.params.id);

      if (!oldArticle) {
        return res.status(404).json({ message: "Không tìm thấy bài viết" });
      }

      const payload = { ...req.body };

      if (req.file) {
        const oldId = extractFileId(oldArticle.thumbnail_url);
        if (oldId) {
          await deleteFile(oldId);
        }

        const uploaded = await uploadFile(
          req.file.buffer,
          req.file.mimetype,
          req.file.originalname
        );

        payload.thumbnail_url = uploaded.url;
      }

      const article = await newsArticleService.update(req.params.id, payload);

      res.json({ message: "Cập nhật thành công", article });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const oldArticle = await newsArticleService.getById(req.params.id);

      if (oldArticle?.thumbnail_url) {
        const oldId = extractFileId(oldArticle.thumbnail_url);
        if (oldId) {
          await deleteFile(oldId);
        }
      }

      await newsArticleService.delete(req.params.id);

      res.json({ message: "Xóa bài viết thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};