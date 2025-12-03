import { adminService } from "../services/admin.service.js";

export const adminController = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const admin = await adminService.login(username, password);

      if (!admin) {
        return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
      }

      return res.json({
        message: "Đăng nhập thành công",
        admin: {
          id: admin.id,
          username: admin.username,
        },
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },

  register: async (req, res) => {
    try {
      const { username, password } = req.body;

      const newAdmin = await adminService.register(username, password);

      if (!newAdmin) {
        return res.status(400).json({ message: "Username đã tồn tại" });
      }

      return res.status(201).json({
        message: "Tạo tài khoản admin thành công",
        admin: {
          id: newAdmin.id,
          username: newAdmin.username,
        },
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
};
