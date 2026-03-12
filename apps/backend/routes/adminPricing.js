import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { dynamicPricing } from "../services/dynamicPricingAI.js";

const router = express.Router();

/* ======================================================
   GET PRICING AI
   GET /api/admin/pricing-ai
====================================================== */
router.get(
  "/pricing-ai",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const data = await dynamicPricing();
      res.json(data);
    } catch (err) {
      res.status(500).json({
        error: "Pricing AI failed",
      });
    }
  }
);

export default router;