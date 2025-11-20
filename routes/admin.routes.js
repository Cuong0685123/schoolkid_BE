import express from "express";
import { adminController } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/login", adminController.login);
router.post("/register", adminController.register);
export default router;
