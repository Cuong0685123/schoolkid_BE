import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";

export const corsOptions = {
  origin: [
    "https://schoolkid-fe-final.vercel.app/",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://schoolkid.vn",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

export const securityMiddlewares = (app) => {
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(hpp());
  app.use("/api/", apiLimiter);
};