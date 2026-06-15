import express from "express";
import { programController } from "../controllers/program.controller.js";
import {
  validateProgramCreate,
  validateProgramUpdate,
  validateProgramChild
} from "../middlewares/program.validation.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ===== CHILD ROUTES - đặt trước /:id =====
router.post(
  "/education",
  upload.single("thumbnail_url"),
  validateProgramChild,
  programController.createEdu
);

router.post(
  "/sport",
  upload.single("thumbnail_url"),
  validateProgramChild,
  programController.createSport
);

router.post(
  "/teacher",
  upload.single("thumbnail_url"),
  validateProgramChild,
  programController.createTeacher
);

router.put(
  "/education/:id",
  upload.single("thumbnail_url"),
  programController.updateEdu
);

router.put(
  "/sport/:id",
  upload.single("thumbnail_url"),
  programController.updateSport
);

router.put(
  "/teacher/:id",
  upload.single("thumbnail_url"),
  programController.updateTeacher
);

router.delete("/education/:id", programController.deleteEdu);
router.delete("/sport/:id", programController.deleteSport);
router.delete("/teacher/:id", programController.deleteTeacher);

// ===== PARENT ROUTES - đặt sau cùng =====
router.post("/", validateProgramCreate, programController.create);
router.get("/", programController.getAll);
router.get("/:id", programController.getById);
router.put("/:id", validateProgramUpdate, programController.update);
router.delete("/:id", programController.delete);

export default router;