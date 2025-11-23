import { models } from "../models/index.js";

export const applicationService = {
  
  // ===== CREATE =====
  create: async (data) => {
    const { program_id } = data;

    // Kiểm tra Program tồn tại
    const program = await models.Program.findByPk(program_id);
    if (!program) throw new Error("Program not found");

    // Tạo application
    return await models.Application.create({
      ...data,
      submitted_at: new Date(),
      status: "pending",
    });
  },

  // ===== GET ALL =====
  getAll: async () => {
    return await models.Application.findAll({
      include: [{ model: models.Program }],
      order: [["id", "DESC"]],
    });
  },

  // ===== GET BY ID =====
  getById: async (id) => {
    return await models.Application.findByPk(id, {
      include: [models.Program],
    });
  },

  // ===== UPDATE =====
  update: async (id, data) => {
    const app = await models.Application.findByPk(id);
    if (!app) throw new Error("Application not found");

    await app.update(data);
    return app;
  },

  // ===== DELETE =====
  delete: async (id) => {
    const app = await models.Application.findByPk(id);
    if (!app) throw new Error("Application not found");

    await app.destroy();
    return true;
  },
};
