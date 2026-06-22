import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";

// ====== Cấu hình CORS ======
export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173", // FE dev
    "https://schoolkid.vn",  // Domain production
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ====== Giới hạn request để chống spam ======
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // tối đa 100 request / 15 phút
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

// ====== Cấu hình bảo mật nâng cao ======
export const securityMiddlewares = (app) => {
  // Cấu hình Helmet (HTTP Header Protection)
  app.use(helmet());

  // Bật CORS
  app.use(cors(corsOptions));

  // Chống HTTP Parameter Pollution
  app.use(hpp());

  // Áp dụng giới hạn request cho tất cả route /api/
  app.use("/api/", apiLimiter);
};
