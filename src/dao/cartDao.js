
import { cartModel } from "../models/cart.model.js";

export class CartDAO {
  static async createCart() {
    return cartModel.create({ products: [] });
  }

  static async getCartById(cid) {
    return cartModel.findById(cid).populate("products.product");
  }

  static async getCartRaw(cid) {
    return cartModel.findById(cid);
  }

  static async updateCartProducts(cid, products) {
    return cartModel.findByIdAndUpdate(cid, { products }, { new: true });
  }

  static async saveCart(cart) {
    return cart.save();
  }
}

