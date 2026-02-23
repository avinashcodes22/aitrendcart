import express from "express";
import Product from "../models/Product.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ============================
   GET AI CONVERSION STATUS
   GET /api/admin/ai-jobs
============================ */
router.get(
  "/ai-jobs",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const products = await Product.find(
        {},
        "name conversionStatus model3dUrl createdAt"
      ).sort({ createdAt: -1 });

      res.json(products);
    } catch (err) {
      console.error("AI jobs fetch error:", err.message);
      res.status(500).json({ error: "Failed to fetch AI jobs" });
    }
  }
);

export default router;
