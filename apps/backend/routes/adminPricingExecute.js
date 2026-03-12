import express from "express";
import Product from "../models/Product.js";
import AiAction from "../models/AiAction.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   SUGGEST DYNAMIC PRICE CHANGE
====================================================== */

router.post(
  "/pricing/suggest",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {

      const { productId, newPrice } = req.body;

      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          error: "Product not found",
        });
      }

      const action = await AiAction.create({
        type: "PRICE_UPDATE",
        payload: {
          productId,
          oldPrice: product.price,
          suggestedPrice: newPrice
        }
      });

      res.json({
        success: true,
        suggestion: action
      });

    } catch (err) {

      console.error("Price suggestion error:", err);

      res.status(500).json({
        error: "Failed to create suggestion",
      });

    }
  }
);

export default router;