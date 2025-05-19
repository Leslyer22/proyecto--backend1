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

router.post("/:cid/product/:pid",auth, authorizeRoles("user"),addProductToCart);


router.delete("/:cid/products/:pid",auth,deleteProductFromCart);

router.put("/:cid",auth,updateCart);

router.put("/:cid/products/:pid",auth,updateProductQuantity);

router.delete("/:cid",auth, clearCart);


router.post("/:cid/purchase", auth, purchaseCart);

export default router;