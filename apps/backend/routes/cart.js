import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/**
 * GET current user's cart
 */
router.get("/", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.uid });
  res.json(cart || { items: [] });
});

/**
 * ADD item to cart
 */
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  let cart = await Cart.findOne({ userId: req.user.uid });
  if (!cart) {
    cart = await Cart.create({ userId: req.user.uid, items: [] });
  }

  const existing = cart.items.find(
    (i) => i.productId.toString() === productId
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      quantity,
    });
  }

  await cart.save();
  res.json(cart);
});

/**
 * UPDATE quantity
 */
router.post("/update", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId: req.user.uid });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items.forEach((item) => {
    if (item.productId.toString() === productId) {
      item.quantity = quantity;
    }
  });

  await cart.save();
  res.json(cart);
});

/**
 * REMOVE item
 */
router.post("/remove", verifyToken, async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ userId: req.user.uid });
  if (!cart) return res.status(404).json({ error: "Cart not found" });

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId
  );

  await cart.save();
  res.json(cart);
});

/**
 * CLEAR cart
 */
router.post("/clear", verifyToken, async (req, res) => {
  await Cart.findOneAndDelete({ userId: req.user.uid });
  res.json({ ok: true });
});

export default router;
