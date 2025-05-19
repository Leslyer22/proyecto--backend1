import { Router } from "express";
import {
  createCart,
  getCartById,
  addProductToCart,
  deleteProductFromCart,
  updateCart,
  updateProductQuantity,
  clearCart, purchaseCart
} from "../controllers/cartsController.js";
import{authorizeRoles} from "./../middleware/authorizeRoles.js";

import {auth} from "../middleware/auth.js";

const router = Router();

router.post("/",auth,authorizeRoles("admin"),createCart);

router.get("/:cid",auth, getCartById);

router.post("/:cid/product/:pid",auth, addProductToCart);


router.delete("/:cid/products/:pid",auth, authorizeRoles("admin"),deleteProductFromCart);

router.put("/:cid",auth,authorizeRoles("admin"),updateCart);

router.put("/:cid/products/:pid",auth,authorizeRoles("admin"),updateProductQuantity);

router.delete("/:cid",auth,authorizeRoles("admin"), clearCart);


router.post("/:cid/purchase", auth, purchaseCart);

export default router;