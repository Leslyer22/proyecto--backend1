import { userDAO } from "../dao/userDao.js";

export class UserService {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async findByEmail(email) {
    return await this.userDAO.findByEmail(email);
  }

  async findById(id) {
    return await this.userDAO.findById(id);
  }

  async createUser(data) {
    return await this.userDAO.createUser(data);
  }
}

export const userService = new UserService(userDAO);