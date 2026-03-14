import { programService } from "../services/program.service.js";

export const programController = {

  // ===== CREATE PROGRAM =====
  create: async (req, res) => {
    try {
      const program = await programService.createProgram(req.body);
      res.json({ message: "Tạo chương trình thành công", program });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    res.json(await programService.getAll());
  },

  getById: async (req, res) => {
    const data = await programService.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  },

  update: async (req, res) => {
    try {
      const program = await programService.updateProgram(req.params.id, req.body);
      res.json({ message: "Cập nhật thành công", program });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      await programService.deleteProgram(req.params.id);
      res.json({ message: "Xóa thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // ===== CHILD CREATE =====
  createEdu: async (req, res) => {
    try {
      const data = await programService.createEdu(req.body);
      res.json({ message: "Tạo EDU child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createSport: async (req, res) => {
    try {
      const data = await programService.createSport(req.body);
      res.json({ message: "Tạo SPORT child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  createTeacher: async (req, res) => {
    try {
      const data = await programService.createTeacher(req.body);
      res.json({ message: "Tạo TEACHER child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // ===== CHILD UPDATE =====
  updateEdu: async (req, res) => {
    try {
      const data = await programService.updateEdu(req.params.id, req.body);
      res.json({ message: "Cập nhật EDU child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateSport: async (req, res) => {
    try {
      const data = await programService.updateSport(req.params.id, req.body);
      res.json({ message: "Cập nhật SPORT child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  updateTeacher: async (req, res) => {
    try {
      const data = await programService.updateTeacher(req.params.id, req.body);
      res.json({ message: "Cập nhật TEACHER child thành công", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

};
