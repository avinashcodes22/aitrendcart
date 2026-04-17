import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   GET /api/admin/trends (FINAL)
====================================================== */

router.get("/", verifyToken, requireRole("admin"), async (req, res) => {

  console.log("🔥 TRENDS API HIT");

  try {

    const range = req.query.range || "30d";

    let startDate;

    if (range === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "7d") {
      startDate = new Date(Date.now() - 7 * 86400000);
    } else {
      startDate = new Date(Date.now() - 30 * 86400000);
    }

    /* ===============================
       SAFE DATA BUILD
    =============================== */

    const orders = await Order.find({
      createdAt: { $gte: startDate }
    }).lean();

    const map = {};

    for (const o of orders) {

      if (!o.items || !Array.isArray(o.items)) continue;

      for (const item of o.items) {

        if (!item || !item.name) continue;

        if (!map[item.name]) {
          map[item.name] = 0;
        }

        map[item.name] += item.quantity || 0;

      }

    }

    const trends = Object.entries(map)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 12);

    res.json({
      success: true,
      trends
    });

  } catch (err) {

    console.error("❌ Trend error:", err);

    res.status(500).json({
      success: false,
      trends: []
    });

  }

});

export default router;