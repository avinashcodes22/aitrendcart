import express from "express";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* =====================================================
   AI SMART RECOMMENDATIONS (v2)
===================================================== */

router.get("/", verifyToken, async (req, res) => {
  try {

    const userId = req.user.uid;

    /* ==========================================
       1️⃣ CART BASED CATEGORY RECOMMENDATIONS
    ========================================== */

    const cart = await Cart.findOne({ userId });

    let category = null;

    if (cart && cart.items.length > 0) {

      const product = await Product.findById(
        cart.items[0].productId
      );

      category = product?.category || null;

    }

    let categoryProducts = [];

    if (category) {

      categoryProducts = await Product.find({
        category
      })
      .limit(4)
      .lean();

    }

    /* ==========================================
       2️⃣ ORDER BASED RECOMMENDATIONS
       "Customers also bought"
    ========================================== */

    const orders = await Order.find({ userId });

    const productMap = {};

    for (const order of orders) {

      for (const item of order.items) {

        const id = String(item.productId);

        if (!productMap[id]) {
          productMap[id] = 0;
        }

        productMap[id] += item.quantity;

      }

    }

    const sorted = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const orderProductIds = sorted.map(p => p[0]);

    let orderProducts = [];

    if (orderProductIds.length > 0) {

      orderProducts = await Product.find({
        _id: { $in: orderProductIds }
      }).lean();

    }

    /* ==========================================
       3️⃣ TRENDING PRODUCTS FALLBACK
    ========================================== */

    const trendingProducts = await Product.find()
      .sort({ arViews: -1 })
      .limit(4)
      .lean();

    /* ==========================================
       MERGE RESULTS
    ========================================== */

    const recommendations = [
      ...categoryProducts,
      ...orderProducts,
      ...trendingProducts
    ];

    /* remove duplicates */

    const unique = [];

    const seen = new Set();

    for (const p of recommendations) {

      const id = String(p._id);

      if (seen.has(id)) continue;

      seen.add(id);

      unique.push(p);

    }

    /* limit final results */

    const final = unique.slice(0, 8);

    res.json({
      success: true,
      products: final
    });

  } catch (err) {

    console.error("Recommend error:", err);

    res.status(500).json({
      error: "Recommendation failed"
    });

  }
});

export default router;