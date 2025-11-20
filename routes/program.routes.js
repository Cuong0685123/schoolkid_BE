import express from "express";
import { programController } from "../controllers/program.controller.js";

const router = express.Router();

router.post("/", programController.create);
router.get("/", programController.getAll);
router.get("/:id", programController.getById);
router.put("/:id", programController.update);
router.delete("/:id", programController.delete);

export default router;
