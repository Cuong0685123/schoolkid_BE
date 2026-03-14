import { models } from "../models/index.js";

export const programService = {

  // ======= CREATE PROGRAM =======
  createProgram: async ({ name, description, type }) => {
    return await models.Program.create({ name, description, type });
  },

  // ======= CREATE CHILD =======
  createEdu: async (data) => {
    const { program_id } = data;
    if (!program_id) throw new Error("program_id is required");
    
    const parent = await models.Program.findByPk(program_id);
    if (!parent) throw new Error("Parent program not found");
    
    if (parent.type !== "edu") {
      throw new Error(`Parent program type mismatch: expected "edu", got "${parent.type}"`);
    }
    
    console.log("data: ", data);
    return await models.ProgramEdu.create(data);
  },

  createSport: async (data) => {
    const { program_id } = data;
    if (!program_id) throw new Error("program_id is required");

    const parent = await models.Program.findByPk(program_id);
    if (!parent) throw new Error("Parent program not found");

    if (parent.type !== "sport") {
      throw new Error(`Parent program type mismatch: expected "sport", got "${parent.type}"`);
    }

    return await models.ProgramSport.create(data);
  },

  createTeacher: async (data) => {
    const { program_id } = data;
    if (!program_id) throw new Error("program_id is required");

    const parent = await models.Program.findByPk(program_id);
    if (!parent) throw new Error("Parent program not found");

    if (parent.type !== "teacher") {
      throw new Error(`Parent program type mismatch: expected "teacher", got "${parent.type}"`);
    }

    return await models.ProgramTeacher.create(data);
  },

  // ======= UPDATE CHILD =======
  updateEdu: async (id, data) => {
    const education = await models.ProgramEdu.findByPk(id);
    if (!education) throw new Error("Education not found");
    return await education.update(data);
  },

  updateSport: async (id, data) => {
    const sport = await models.ProgramSport.findByPk(id);
    if (!sport) throw new Error("Sport not found");
    return await sport.update(data);
  },

  updateTeacher: async (id, data) => {
    const teacher = await models.ProgramTeacher.findByPk(id);
    if (!teacher) throw new Error("Teacher not found");
    return await teacher.update(data);
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

  // ======= GET ONE =======
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

    await program.update({
      name: data.name,
      description: data.description,
      type: data.type,
    });

    return program;
  },

  // ======= DELETE =======
  deleteProgram: async (id) => {
    const program = await models.Program.findByPk(id);
    if (!program) throw new Error("Program not found");

    // Xóa child theo type
    await models.ProgramEdu.destroy({ where: { program_id: id } });
    await models.ProgramSport.destroy({ where: { program_id: id } });
    await models.ProgramTeacher.destroy({ where: { program_id: id } });

    await program.destroy();
    return true;
  },

};
