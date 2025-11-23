import { newsArticleService } from "../services/newsArticle.service.js";

export const newsArticleController = {
  create: async (req, res) => {
    try {
      const article = await newsArticleService.create(req.body);
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
    if (!data) return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(data);
  },

  update: async (req, res) => {
    try {
      const article = await newsArticleService.update(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công", article });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await newsArticleService.delete(req.params.id);
      res.json({ message: "Xóa bài viết thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
