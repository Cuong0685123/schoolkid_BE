import express from "express";
import { applicationController } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/", applicationController.create);
router.get("/", applicationController.getAll);
router.get("/:id", applicationController.getById);
router.put("/:id", applicationController.update);
router.delete("/:id", applicationController.delete);

export default router;
