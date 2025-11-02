import pool from "../config/database.js";

export const UserModel = {
  async findAll() {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0];
  },

  async create(user) {
    const { name, email } = user;
    const [result] = await pool.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    return { id: result.insertId, ...user };
  },
};
