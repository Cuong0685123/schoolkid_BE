import dotenv from "dotenv";
dotenv.config();

import { initDatabase } from "./models/index.js";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
