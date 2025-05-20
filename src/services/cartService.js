
import { CartDAO } from "../dao/cartDao.js";

class CartService {
  constructor(dao) {
    this.cartDAO = dao;
  }

  async createCart() {
    return await this.cartDAO.createCart();
  }

  async getCartById(cid) {
    return await this.cartDAO.getCartById(cid);
  }

  async getCartRaw(cid) {
    return await this.cartDAO.getCartRaw(cid);
  }

  async updateCartProducts(cid, products) {
    return await this.cartDAO.updateCartProducts(cid, products);
  }

  async saveCart(cart) {
    return await this.cartDAO.saveCart(cart);
  }
}

export const cartService = new CartService(CartDAO);
