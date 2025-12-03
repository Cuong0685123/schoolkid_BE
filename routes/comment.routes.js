import express from "express";
import { commentController } from "../controllers/comment.controller.js";
import {
  validateCommentCreate,
  validateCommentUpdate,
} from "../middlewares/comment.validation.js";

const router = express.Router();

router.post("/", validateCommentCreate, commentController.create);
router.get("/", commentController.getAll);
router.get("/:id", commentController.getById);
router.put("/:id", validateCommentUpdate, commentController.update);
router.delete("/:id", commentController.delete);

export default router;
