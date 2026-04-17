import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   REAL SUPPLIER PERFORMANCE
====================================================== */

router.get("/", verifyToken, requireRole("admin"), async (req, res) => {

  try {

    const orders = await Order.find().lean();

    const map = {};

    for (const order of orders) {

      for (const item of order.items) {

        const supplier = item.supplier || "unknown";

        if (!map[supplier]) {
          map[supplier] = {
            name: supplier,
            orders: 0,
            revenue: 0
          };
        }

        map[supplier].orders += item.quantity;
        map[supplier].revenue += item.quantity * item.price;

      }

    }

    const result = Object.values(map)
      .map(s => ({
        ...s,
        score: Math.round(s.revenue * 0.01 + s.orders * 5)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.json(result);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Failed" });

  }

});

export default router;