import { Router } from "express";
import { productService } from "../services/productService.js";
import { cartService } from "../services/cartService.js";

const router = Router();


router.get("/realtimeproducts", async (req, res) => {
  const productsData = await productService.getProducts({}, { page: 1, limit: 100 });
  res.render("realTimeProducts", { products: productsData.docs });
});

// Ruta para productos paginados 
router.get("/products", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const productsData = await productService.getProducts({}, { page: Number(page), limit: Number(limit) });
  res.render("products", { products: productsData.docs, page: Number(page), totalPages: productsData.totalPages });
});

// Paso 6: Vista individual producto
router.get("/products/:pid", async (req, res) => {
  const product = await productService.getProductById(req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  res.render("productDetail", { product });
});

// Paso 7: Vista carrito
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartService.getCartById(req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.render("cartDetail", { cart });
});

export default router;
