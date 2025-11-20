import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTES
import adminRoutes from "./routes/admin.routes.js";
import router from "./routes/index.js";
import programRoutes from "./routes/program.routes.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES

app.use("/api/admin", adminRoutes);
app.use("/api/programs", programRoutes);
export default app;
