import bcrypt from "bcrypt";
import { models } from "../models/index.js";

export const adminService = {
  login: async (username, password) => {
    const admin = await models.Admin.findOne({ where: { username } });
    if (!admin) return null;

      if (admin.password !== password) return null;

    return admin;
  },
};
