import { verifyToken } from "../config/security.js";
import { errorResponse } from "../utils/apiResponse.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return errorResponse(res, "Access denied. No token provided.", 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, "Invalid or expired token.", 403);
  }

  req.user = decoded; // Lưu thông tin user từ token
  next();
};
