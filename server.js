import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { securityMiddlewares } from "./config/securityPolicy.js";

dotenv.config();

const app = express();
securityMiddlewares(app);
// ====== Middleware cơ bản ======
app.use(helmet());
app.use(cors());
app.use(express.json());

// ====== Định tuyến ======
app.use("/api", routes);

// ====== Khởi động server ======
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
