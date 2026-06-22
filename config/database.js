import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.local"
});

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);