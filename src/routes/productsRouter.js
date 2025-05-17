
import{
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js"

import {auth} from "../middleware/auth.js";

import {Router} from "express";

const router = Router();

// GET /api/products => con paginación, filtro y orden
router.get("/",auth, getProducts);

// GET /api/products/:pid => producto por ID
router.get("/:pid",auth, getProductById);

// POST /api/products => agregar producto
router.post("/",auth, addProduct);

// PUT /api/products/:pid => actualizar producto por ID
router.put("/:pid",auth, updateProduct);

// DELETE /api/products/:pid => eliminar producto por ID
router.delete("/:pid",auth, deleteProduct);

export default router;