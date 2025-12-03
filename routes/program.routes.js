import express from "express";
import { programController } from "../controllers/program.controller.js";
import {
  validateProgramCreate,
  validateProgramUpdate,
  validateProgramChild
} from "../middlewares/program.validation.js";

const router = express.Router();

router.post("/", validateProgramCreate, programController.create);
router.get("/", programController.getAll);
router.get("/:id", programController.getById);
router.put("/:id", validateProgramUpdate, programController.update);
router.delete("/:id", programController.delete);

router.post("/edu", validateProgramChild, programController.createEdu);
router.post("/sport", validateProgramChild, programController.createSport);
router.post("/teacher", validateProgramChild, programController.createTeacher);

export default router;
