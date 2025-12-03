import express from "express";
import { adminController } from "../controllers/admin.controller.js";
import { validateAdminLogin, validateAdminRegister } from "../middlewares/adminValidator.js";

const router = express.Router();

router.post("/login", validateAdminLogin, adminController.login);
router.post("/register", validateAdminRegister, adminController.register);

export default router;
