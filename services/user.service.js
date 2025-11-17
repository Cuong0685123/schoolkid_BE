// import { UserModel } from "../models/user.model.js";

// export const UserService = {
//   async getAllUsers() {
//     return await UserModel.findAll();
//   },

//   async getUserById(id) {
//     const user = await UserModel.findById(id);
//     if (!user) throw new Error("User not found");
//     return user;
//   },

//   async createUser(data) {
//     if (!data.name || !data.email) throw new Error("Missing name or email");
//     return await UserModel.create(data);
//   },
// };
