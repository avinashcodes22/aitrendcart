import express from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* --------------------------------
   SMART RECOMMENDATIONS
--------------------------------- */
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.uid });

    let category = null;

    if (cart && cart.items.length > 0) {
      const product = await Product.findById(
        cart.items[0].productId
      );
      category = product?.category;
    }

    const query = category
      ? { category }
      : {};

    const products = await Product.find(query)
      .limit(8)
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Recommend error:", err.message);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

export default router;
