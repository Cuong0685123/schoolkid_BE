import express from "express";
import { promotionalVideoController } from "../controllers/promotionalVideo.controller.js";
import { getAuthUrl, getToken } from "../services/googleDrive.service.js";

const router = express.Router();

// OAuth
router.get("/auth", (req, res) => {
  res.json({ authUrl: getAuthUrl() });
});

router.get("/oauth2callback", async (req, res) => {
  try {
    await getToken(req.query.code);
    res.send("OAuth thành công");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CRUD
router.post( "/",
  promotionalVideoController.uploadMiddleware,
  promotionalVideoController.create
);

router.get("/", promotionalVideoController.getAll);

router.get("/:id", promotionalVideoController.getById);

router.put( "/:id",
  promotionalVideoController.uploadMiddleware,
  promotionalVideoController.update
);

router.delete("/:id", promotionalVideoController.delete);

export default router;