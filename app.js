import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// ROUTES
import adminRoutes from "./routes/admin.routes.js";
import router from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ROUTES
app.use("/api", router);
app.use("/api/admin", adminRoutes);

export default app;
