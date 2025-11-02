import { UserService } from "../services/user.service.js";
import { success, error } from "../utils/apiResponse.js";

export const UserController = {
  async getAll(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(success(users));
    } catch (err) {
      res.status(500).json(error(err.message));
    }
  },

  async getById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.json(success(user));
    } catch (err) {
      res.status(404).json(error(err.message));
    }
  },

  async create(req, res) {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(success(user, "User created"));
    } catch (err) {
      res.status(400).json(error(err.message));
    }
  },
};
