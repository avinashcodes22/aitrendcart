import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* ============================
   SAVE / UPDATE ADDRESS
============================ */
router.post("/address", verifyToken, async (req, res) => {
  const data = {
    ...req.body,
    userId: req.user.uid
  };

  const address = await Address.findOneAndUpdate(
    { userId: req.user.uid },
    data,
    { upsert: true, new: true }
  );

  res.json(address);
});

/* ============================
   CHECKOUT SUMMARY (SAFE)
============================ */
router.get("/summary", verifyToken, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.uid });

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "Cart empty" });
  }

  let total = 0;
  const verifiedItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    const lineTotal = product.price * item.quantity;
    total += lineTotal;

    verifiedItems.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      lineTotal
    });
  }

  res.json({ items: verifiedItems, total });
});

export default router;
