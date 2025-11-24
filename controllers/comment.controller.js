import { commentService } from "../services/comment.service.js";

export const commentController = {
  create: async (req, res) => {
    try {
      const comment = await commentService.create(req.body);
      res.json({ message: "Tạo comment thành công", comment });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    const data = await commentService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const data = await commentService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy comment" });
    res.json(data);
  },

  update: async (req, res) => {
    try {
      const comment = await commentService.update(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công", comment });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await commentService.delete(req.params.id);
      res.json({ message: "Xóa comment thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
