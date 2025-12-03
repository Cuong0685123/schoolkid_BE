// middlewares/program.validation.js

export const validateProgramCreate = (req, res, next) => {
  const { name, type } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "Tên chương trình không được để trống" });
  }

  if (!["edu", "sport", "teacher"].includes(type)) {
    return res.status(400).json({ message: "Type không hợp lệ (edu, sport, teacher)" });
  }

  next();
};

export const validateProgramUpdate = (req, res, next) => {
  const { name } = req.body;

  if (name && name.trim().length === 0) {
    return res.status(400).json({ message: "Tên chương trình không hợp lệ" });
  }

  next();
};

// ===== VALIDATION CHILD =====
export const validateProgramChild = (req, res, next) => {
  const { program_id } = req.body;
  if (!program_id) {
    return res.status(400).json({ message: "program_id là bắt buộc" });
  }
  next();
};
