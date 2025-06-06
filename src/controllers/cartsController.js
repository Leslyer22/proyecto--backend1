import { cartService } from "../services/cartService.js";
import { productService } from "../services/productService.js";
import { ticketService } from "../services/ticketService.js";
import { generateUniqueCode } from "../utils/generateCode.js";

//import { ticketModel } from "../models/ticket.model.js";



export const createCart = async (req, res) => {
    
  try {

    //const newCart = await cartModel.create({ products: [] });
    const newCart = await cartService.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error creating cart" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;

    //const cart = await cartModel.findById(cid).populate("products.product");
    const cart = await cartService.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;  // venir de postman


     //const productExists = await productModel.findById(pid);
     const productExists = await productService.getProductById(pid);
    if (!productExists) {
      return res.status(404).json({ error: "Product not found" });
    }

    //const cart = await cartModel.findById(cid);
     const cart = await cartService.getCartRaw(cid);  

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

   if (productIndex !== -1) {
    cart.products[productIndex].quantity += quantity;  // suma la cantidad correcta
  } else {
    cart.products.push({ product: pid, quantity: quantity });
  }


    //await cart.save();
     await cartService.saveCart(cart);
    res.json(cart);
  } catch (error) {
    console.log( "error:",error)
    res.status(500).json({ error: "Error adding product to cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products;

    //const cart = await cartModel.findById(cid);
     const cart = await cartService.getCartRaw(cid);

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = newProducts;

    //await cart.save();
    await cartService.saveCart(cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    //const cart = await cartModel.findById(cid); 
    const cart = await cartService.getCartRaw(cid); 

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;

    //await cart.save(); 
     await cartService.saveCart(cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating product quantity" });
  }
};


export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    //const cart = await cartModel.findById(cid);
    const cart = await cartService.getCartRaw(cid);

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== pid
    );

    //await cart.save();
     await cartService.saveCart(cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error removing product from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params; 

    //const cart = await cartModel.findById(cid);
 const cart = await cartService.getCartRaw(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = [];

   // await cart.save();
    await cartService.saveCart(cart);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error clearing cart" });
  }
};


export const purchaseCart = async (req, res) => {
  const cartId = req.params.cid;

  try {
    //const cart = await cartModel.findById(cartId).populate("products.product"); 
     const cart = await cartService.getCartById(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productsToBuy = cart.products;
    const purchasedProducts = [];
    const notProcessed = [];

    let totalAmount = 0;
    
    //verificamos si hay productos en el carrito
    for (const item of productsToBuy) {
      if (!item.product) {
        notProcessed.push(null);
        continue;
      }

      //const dbProduct = await productModel.findById(item.product._id);
         const dbProduct = await productService.getProductById(item.product._id);

      if (dbProduct && dbProduct.stock >= item.quantity) {
        dbProduct.stock -= item.quantity;
        //await dbProduct.save();
        await productService.saveProduct(dbProduct);

        purchasedProducts.push(item);
        totalAmount += item.quantity * dbProduct.price;
      } else {
        notProcessed.push(item.product._id);
      }
    }

    // Solo creamos ticket si hay productos comprados
    if (purchasedProducts.length > 0) {
      /*const ticket = await ticketModel.create({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchaser: req.user.email, // Asegúrate de que req.user venga de autenticación
      }); */

      const ticket = await ticketService.createTicket({
  code: generateUniqueCode(),
  purchase_datetime: new Date(),
  amount: totalAmount,
  purchaser: req.user.email
});


      // Actualizamos el carrito dejando solo los productos no procesados
      cart.products = cart.products.filter(
        (item) => item.product && notProcessed.includes(item.product._id.toString())
      );
      //await cart.save();
        await cartService.saveCart(cart);

      return res.status(200).json({
        status: "success",
        message: "Purchase completed",
        ticket,
        notProcessed,
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "No products could be processed due to lack of stock",
        notProcessed,
      });
    }
  } catch (error) {
    console.error("❌ Error in purchaseCart:", error);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
