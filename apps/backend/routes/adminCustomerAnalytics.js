import express from "express";
import { analyzeCustomers } from "../services/customerAnalyticsAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* =====================================================
   CUSTOMER ANALYTICS
===================================================== */

router.get(
  "/customer-analytics",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const data = await analyzeCustomers();

      res.json({
        success: true,
        customers: data
      });

    } catch (err) {

      console.error("Customer analytics error:", err);

      res.status(500).json({
        error: "Analytics failed"
      });

    }
  }
);

export default router;