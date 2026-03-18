import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env.local'
})

export const sequelize = new Sequelize(
  process.env.DB_NAME,     // database
  process.env.DB_USER,     // user
  process.env.DB_PASS,     // password
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);
