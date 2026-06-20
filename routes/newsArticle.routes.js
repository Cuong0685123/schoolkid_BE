import express from "express";
import { newsArticleController } from "../controllers/newsArticle.controller.js";

const router = express.Router();

router.post(
  "/",
  newsArticleController.uploadMiddleware,
  newsArticleController.create
);

router.get("/", newsArticleController.getAll);

router.get("/:id", newsArticleController.getById);

router.put(
  "/:id",
  newsArticleController.uploadMiddleware,
  newsArticleController.update
);

router.delete("/:id", newsArticleController.delete);

export default router;