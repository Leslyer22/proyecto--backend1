
import{
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productsController.js"

import {auth} from "../middleware/auth.js";

import {Router} from "express";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

//OK
// GET /api/products => con paginación, filtro y orden
router.get("/",auth, getProducts);

//OK
// GET /api/products/:pid => producto por ID
router.get("/:pid",auth, getProductById);

// OK
// POST /api/products => agregar producto
router.post("/",auth,authorizeRoles("admin"), addProduct);


// OK (user no puede ) admin :
// PUT /api/products/:pid => actualizar producto por ID
router.put("/:pid",auth,authorizeRoles("admin"), updateProduct);

//OK (user no puede) admin:
// DELETE /api/products/:pid => eliminar producto por ID
router.delete("/:pid",auth,authorizeRoles("admin"), deleteProduct);

export default router;