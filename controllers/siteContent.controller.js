import { siteContentService } from "../services/siteContent.service.js";

export const siteContentController = {
  getAll: async (req, res) => {
    try {
      const list = await siteContentService.getAll();
      res.json(list);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const rec = await siteContentService.getById(req.params.id);
      if (!rec) return res.status(404).json({ message: "không tìm thấy" });

      res.json(rec);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  create: async (req, res) => {
    try {
      const rec = await siteContentService.create(req.body);
      res.status(201).json({ message: "tạo thành công", data: rec });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const rec = await siteContentService.update(req.params.id, req.body);
      res.json({ message: "cập nhật", data: rec });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await siteContentService.remove(req.params.id);
      res.json({ message: "xoá" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
