import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* GET /api/admin/trends */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const range = req.query.range || "30d";

    const now = new Date();
    let startDate = new Date(0);

    if (range === "today") {
      startDate = new Date(now.setHours(0,0,0,0));
    }
    if (range === "7d") {
      startDate = new Date(Date.now() - 7*86400000);
    }
    if (range === "30d") {
      startDate = new Date(Date.now() - 30*86400000);
    }

    const trends = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          sales: { $sum: "$items.quantity" }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 10 }
    ]);

    res.json(trends.map(t => ({
      name: t._id,
      sales: t.sales
    })));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Trend load failed" });
  }
});

export default router;