import express from "express";
import Order from "../models/Order.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* =====================================================
   BUSINESS + AI ANALYTICS (FULL)
===================================================== */

router.get(
  "/analytics",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const orders = await Order.find();

      let totalRevenue = 0;
      let totalOrders = orders.length;

      const dailyRevenue = {};
      const productMap = {};

      /* ===============================
         PROCESS ORDERS
      =============================== */

      for (const order of orders) {

        totalRevenue += order.amount || 0;

        /* DAILY REVENUE */
        const date = new Date(order.createdAt)
          .toISOString()
          .slice(0, 10);

        dailyRevenue[date] =
          (dailyRevenue[date] || 0) + (order.amount || 0);

        /* PRODUCT SALES */
        for (const item of order.items || []) {

          const name = item.name;

          if (!productMap[name]) {
            productMap[name] = 0;
          }

          productMap[name] += item.quantity;

        }

      }

      /* ===============================
         TOP PRODUCTS
      =============================== */

      const topProducts = Object.entries(productMap)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

      /* ===============================
         🔮 REVENUE AI
      =============================== */

      const last7Days = Object.values(dailyRevenue).slice(-7);

      const avgDaily =
        last7Days.length > 0
          ? last7Days.reduce((a, b) => a + b, 0) / last7Days.length
          : 0;

      const next7Days = Math.round(avgDaily * 7);
      const next30Days = Math.round(avgDaily * 30);

      /* ===============================
         🔮 PRODUCT AI
      =============================== */

      const productPredictions = Object.entries(productMap)
        .map(([name, totalQty]) => {

          const avg = totalQty / 30;

          return {
            name,
            totalSold: totalQty,
            next7Days: Math.round(avg * 7),
            next30Days: Math.round(avg * 30)
          };

        })
        .sort((a, b) => b.next7Days - a.next7Days)
        .slice(0, 5);

      /* ===============================
         RESPONSE
      =============================== */

      res.json({
        success: true,
        totalRevenue,
        totalOrders,
        avgOrderValue:
          totalOrders > 0
            ? Math.round(totalRevenue / totalOrders)
            : 0,
        dailyRevenue,
        topProducts,

        prediction: {
          avgDaily: Math.round(avgDaily),
          next7Days,
          next30Days
        },

        productPredictions
      });

    } catch (err) {

      console.error("Analytics error:", err);

      res.status(500).json({
        error: "Analytics failed"
      });

    }

  }
);

export default router;