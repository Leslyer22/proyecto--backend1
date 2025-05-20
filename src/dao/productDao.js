import { productModel } from "../models/product.model.js";

export class ProductDAO {
  static async getProducts(filter, options) {
    return await productModel.paginate(filter, options);
  }

  static async getProductById(pid) {
    return productModel.findById(pid);
  }

  static async createProduct(data) {
    return productModel.create(data);
  }

  static async updateProduct(pid, updateData) {
    return productModel.findByIdAndUpdate(pid, updateData, { new: true });
  }

  static async deleteProduct(pid) {
    return productModel.findByIdAndDelete(pid);
  }

  static async saveProduct(product) {
    return product.save();
  }
}
