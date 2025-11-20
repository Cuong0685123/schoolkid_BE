import bcrypt from "bcrypt";
import { models } from "../models/index.js";

export const adminService = {
  login: async (username, password) => {
    const admin = await models.Admin.findOne({ where: { username } });
    if (!admin) return null;

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return null;

    return admin;
  },

  register: async (username, password) => {
    // Check username tồn tại chưa
    const exists = await models.Admin.findOne({ where: { username } });
    if (exists) return null;

    const hashed = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const newAdmin = await models.Admin.create({
      username,
      password: hashed,
    });

    return newAdmin;
  },
};
