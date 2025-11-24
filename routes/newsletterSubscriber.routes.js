import express from "express";
import { newsletterSubscriberController } from "../controllers/newsletterSubscriber.controller.js";

const router = express.Router();

router.post("/", newsletterSubscriberController.create);
router.get("/", newsletterSubscriberController.getAll);
router.get("/:id", newsletterSubscriberController.getById);
router.put("/:id", newsletterSubscriberController.update);
router.delete("/:id", newsletterSubscriberController.delete);

export default router;
