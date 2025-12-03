import express from "express";
import { applicationController } from "../controllers/application.controller.js";
import {
  validateApplicationCreate,
  validateApplicationUpdate,
} from "../middlewares/application.validation.js";

const router = express.Router();

router.post("/", validateApplicationCreate, applicationController.create);
router.get("/", applicationController.getAll);
router.get("/:id", applicationController.getById);
router.put("/:id", validateApplicationUpdate, applicationController.update);
router.delete("/:id", applicationController.delete);

export default router;
