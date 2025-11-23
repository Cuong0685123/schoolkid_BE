import { applicationService } from "../services/application.service.js";

export const applicationController = {
  
  create: async (req, res) => {
    try {
      const app = await applicationService.create(req.body);
      res.json({ message: "Tạo hồ sơ ứng tuyển thành công", application: app });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    const data = await applicationService.getAll();
    res.json(data);
  },

  getById: async (req, res) => {
    const data = await applicationService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  },

  update: async (req, res) => {
    try {
      const updated = await applicationService.update(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công", application: updated });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await applicationService.delete(req.params.id);
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

};
