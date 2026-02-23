import express from "express";
import Product from "../models/Product.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* =================================
   ADMIN ONLY — GET ALL PRODUCTS
   GET /api/admin/products
================================= */
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .lean();

      res.json(products);
    } catch (err) {
      console.error("Admin fetch products error:", err.message);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
);

export default router;
