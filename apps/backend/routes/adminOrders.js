import express from "express";
import Order from "../models/Order.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* =====================================================
   ADMIN - GET ALL ORDERS
===================================================== */

router.get(
  "/orders",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .lean();

      res.json({
        success: true,
        orders
      });

    } catch (err) {

      console.error("Admin orders error:", err);

      res.status(500).json({
        success: false,
        error: "Failed to fetch orders"
      });

    }

  }
);
/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

router.put(
  "/orders/:id/status",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const { status } = req.body;

      const allowed = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ];

      if (!allowed.includes(status)) {
        return res.status(400).json({
          error: "Invalid status"
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          error: "Order not found"
        });
      }

      res.json({
        success: true,
        order
      });

    } catch (err) {

      console.error("Status update error:", err);

      res.status(500).json({
        error: "Failed to update status"
      });

    }

  }
);

export default router;