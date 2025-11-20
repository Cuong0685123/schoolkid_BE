import { models } from "../models/index.js";

export const programService = {

  // ======= CREATE =======
  createProgram: async (data) => {
    const { name, description, type, detail } = data;

    // 1. Tạo bảng Program
    const program = await models.Program.create({ name, description, type });

    // 2. Tạo bảng con theo type
    await programService.createChildData(type, program.id, detail);

    return program;
  },


  createChildData: async (type, program_id, detail) => {
    if (type === "edu") {
      return await models.ProgramEdu.create({ program_id, ...detail });
    }
    if (type === "sport") {
      return await models.ProgramSport.create({ program_id, ...detail });
    }
    if (type === "teacher") {
      return await models.ProgramTeacher.create({ program_id, ...detail });
    }
    throw new Error("Invalid program type");
  },


  // ======= GET ALL =======
  getAll: async () => {
    return await models.Program.findAll({
      include: [
        models.ProgramEdu,
        models.ProgramSport,
        models.ProgramTeacher,
      ],
    });
  },


  // ======= GET DETAIL =======
  getById: async (id) => {
    return await models.Program.findByPk(id, {
      include: [
        models.ProgramEdu,
        models.ProgramSport,
        models.ProgramTeacher,
      ],
    });
  },


  // ======= UPDATE =======
  updateProgram: async (id, data) => {
    const program = await models.Program.findByPk(id);
    if (!program) throw new Error("Program not found");

    const { name, description, detail } = data;

    await program.update({ name, description });

    // Cập nhật bảng con theo type
    await programService.updateChildData(program.type, id, detail);

    return program;
  },


  updateChildData: async (type, program_id, detail) => {
    if (!detail) return;

    if (type === "edu") {
      return await models.ProgramEdu.update(detail, { where: { program_id } });
    }
    if (type === "sport") {
      return await models.ProgramSport.update(detail, { where: { program_id } });
    }
    if (type === "teacher") {
      return await models.ProgramTeacher.update(detail, { where: { program_id } });
    }
  },


  // ======= DELETE =======
  deleteProgram: async (id) => {
    const program = await models.Program.findByPk(id);
    if (!program) throw new Error("Program not found");

    // Xóa bảng con trước
    await programService.deleteChildData(program.type, id);

    // Xóa bảng Program
    await program.destroy();

    return true;
  },


  deleteChildData: async (type, program_id) => {
    if (type === "edu") {
      return await models.ProgramEdu.destroy({ where: { program_id } });
    }
    if (type === "sport") {
      return await models.ProgramSport.destroy({ where: { program_id } });
    }
    if (type === "teacher") {
      return await models.ProgramTeacher.destroy({ where: { program_id } });
    }
  },
};
