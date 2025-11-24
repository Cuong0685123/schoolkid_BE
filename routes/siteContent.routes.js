import express from "express";
import { siteContentController } from "../controllers/siteContent.controller.js";

const router = express.Router();

router.get("/", siteContentController.getAll);
router.get("/:id", siteContentController.getById);
router.post("/", siteContentController.create);
router.put("/:id", siteContentController.update);
router.delete("/:id", siteContentController.delete);

export default router;
