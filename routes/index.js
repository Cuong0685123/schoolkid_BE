import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API OK" });
});

router.get("/", (req, res) => {
  res.json({ message: "Backend OK" });
});


export default router;
