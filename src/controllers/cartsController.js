import {cartModel} from "../models/cart.model.js";

export const createCart = async (req, res) => {
    
  try {
    const newCart = await cartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error creating cart" });
  }
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const newProducts = req.body.products;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = newProducts;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in cart" });
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating product quantity" });
  }
};


export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== pid
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error removing product from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.products = [];

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error clearing cart" });
  }
};

