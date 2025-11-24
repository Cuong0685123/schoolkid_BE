import { models } from "../models/index.js";

export const siteContentService = {
  getAll: async () => {
    return await models.SiteContent.findAll();
  },

  getById: async (id) => {
    return await models.SiteContent.findByPk(id);
  },

  create: async (data) => {
    // ID phải được truyền vào vì không auto-increment
    if (!data.id) {
      throw new Error("ID is required because it is not auto-increment.");
    }

    const exists = await models.SiteContent.findByPk(data.id);
    if (exists) throw new Error("Record with this ID already exists.");

    return await models.SiteContent.create(data);
  },

  update: async (id, data) => {
    const rec = await models.SiteContent.findByPk(id);
    if (!rec) throw new Error("Site content not found.");

    await rec.update(data);
    return rec;
  },

  remove: async (id) => {
    const rec = await models.SiteContent.findByPk(id);
    if (!rec) throw new Error("Site content not found.");

    await rec.destroy();
    return true;
  },
};
