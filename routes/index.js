import express from "express";
import userRoutes from "./user.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.get("/", (req, res) => res.send("SchoolKid API is running 🚀"));

export default router;
