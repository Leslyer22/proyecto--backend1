import {userModel} from "../models/user.model.js";

class UserDAO {
  async findByEmail(email) {
    return await userModel.findOne({ email });
  }

  async findById(id) {
    return await userModel.findById(id);
  }

  async createUser(data) {
    return await userModel.create(data);
  }
}

export const userDAO = new UserDAO();
