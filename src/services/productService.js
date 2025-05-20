import { ProductDAO } from "../dao/productDao.js";

class ProductService {
  constructor(dao) {
    this.productDAO = dao;
  }

  async getProducts(filter, options) {
    return await this.productDAO.getProducts(filter, options);
  }

  async getProductById(pid) {
    return await this.productDAO.getProductById(pid);
  }

  async createProduct(data) {
    return await this.productDAO.createProduct(data);
  }

  async updateProduct(pid, updateData) {
    return await this.productDAO.updateProduct(pid, updateData);
  }

  async deleteProduct(pid) {
    return await this.productDAO.deleteProduct(pid);
  }

  async saveProduct(product) {
    return await this.productDAO.saveProduct(product);
  }
}

export const productService = new ProductService(ProductDAO);
