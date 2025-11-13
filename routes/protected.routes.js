import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { successResponse } from "../utils/apiResponse.js";

const router = express.Router();

// Route được bảo vệ — chỉ user có token hợp lệ mới truy cập được
router.get("/profile", authenticate, (req, res) => {
  return successResponse(res, req.user, "Authenticated user profile");
});

export default router;
