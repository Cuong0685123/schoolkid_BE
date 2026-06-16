import fs from "fs";
import { programService } from "../services/program.service.js";
import { uploadFile } from "../services/googleDrive.service.js";

const removeTempFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const uploadImageIfExists = async (file) => {
  if (!file) return null;

  const uploaded = await uploadFile(
    file.path,
    file.mimetype,
    file.originalname
  );

  removeTempFile(file.path);

  return uploaded.url;
};

export const programController = {
  // ===== PARENT PROGRAM =====
  create: async (req, res) => {
    try {
      const program = await programService.createProgram(req.body);
      res.json({ message: "Tạo chương trình thành công", program });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await programService.getAll();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await programService.getById(req.params.id);
      if (!data) return res.status(404).json({ message: "Không tìm thấy" });

      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
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
      const thumbnailUrl = await uploadImageIfExists(req.file);

      const data = await programService.createEdu({
        ...req.body,
        thumbnail_url: thumbnailUrl || req.body.thumbnail_url,
      });

      res.json({ message: "Tạo EDU child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  createSport: async (req, res) => {
    try {
      const thumbnailUrl = await uploadImageIfExists(req.file);

      const data = await programService.createSport({
        ...req.body,
        thumbnail_url: thumbnailUrl || req.body.thumbnail_url,
      });

      res.json({ message: "Tạo SPORT child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  createTeacher: async (req, res) => {
    try {
      const profileImageUrl = await uploadImageIfExists(req.file);

      const data = await programService.createTeacher({
        ...req.body,
        profile_image_url: profileImageUrl || req.body.profile_image_url,
      });

      res.json({ message: "Tạo TEACHER child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  // ===== CHILD UPDATE =====
  updateEdu: async (req, res) => {
    try {
      const updateData = { ...req.body };
      const thumbnailUrl = await uploadImageIfExists(req.file);

      if (thumbnailUrl) {
        updateData.thumbnail_url = thumbnailUrl;
      }

      const data = await programService.updateEdu(req.params.id, updateData);
      res.json({ message: "Cập nhật EDU child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  updateSport: async (req, res) => {
    try {
      const updateData = { ...req.body };
      const thumbnailUrl = await uploadImageIfExists(req.file);

      if (thumbnailUrl) {
        updateData.thumbnail_url = thumbnailUrl;
      }

      const data = await programService.updateSport(req.params.id, updateData);
      res.json({ message: "Cập nhật SPORT child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  updateTeacher: async (req, res) => {
    try {
      const updateData = { ...req.body };
      const profileImageUrl = await uploadImageIfExists(req.file);

      if (profileImageUrl) {
        updateData.profile_image_url = profileImageUrl;
      }

      const data = await programService.updateTeacher(req.params.id, updateData);
      res.json({ message: "Cập nhật TEACHER child thành công", data });
    } catch (err) {
      removeTempFile(req.file?.path);
      res.status(400).json({ message: err.message });
    }
  },

  // ===== CHILD DELETE =====
  deleteEdu: async (req, res) => {
    try {
      await programService.deleteEdu(req.params.id);
      res.json({ message: "Xóa EDUCATION child thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteSport: async (req, res) => {
    try {
      await programService.deleteSport(req.params.id);
      res.json({ message: "Xóa SPORT child thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  deleteTeacher: async (req, res) => {
    try {
      await programService.deleteTeacher(req.params.id);
      res.json({ message: "Xóa TEACHER child thành công" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};