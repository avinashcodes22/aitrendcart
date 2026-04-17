import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { predictNext } from "../services/aiTrendPredictor.js";

const router = express.Router();

/* ======================================================
   GET REAL AI PREDICTIONS (CHART + AI)
   GET /api/admin/predictions
====================================================== */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {

    const range = req.query.range || "30d";

    let days = 30;
    if (range === "7d") days = 7;
    if (range === "today") days = 1;

    const startDate = new Date(
      Date.now() - days * 86400000
    );

    /* ===============================
       TIME SERIES SALES (FOR CHART)
    =============================== */

    const sales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          totalSales: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartData = sales.map((d, i) => {

      const predicted =
        i > 0
          ? Math.round(
              (d.totalSales + sales[i - 1].totalSales) / 2
            )
          : d.totalSales;

      return {
        date: d._id,
        sales: d.totalSales,
        predictedSales: predicted
      };

    });

    /* ===============================
       PRODUCT AI PREDICTIONS
    =============================== */

    const orders = await Order.find().lean();

    const historyMap = {};

    for (const o of orders) {
      for (const item of o.items) {
        if (!historyMap[item.name]) {
          historyMap[item.name] = [];
        }
        historyMap[item.name].push(item.quantity);
      }
    }

    const productPredictions = [];

    for (const name in historyMap) {

      const predicted = await predictNext(historyMap[name]);

      productPredictions.push({
        name,
        predictedSales: predicted,
        history: historyMap[name],
      });

    }

    productPredictions.sort((a, b) => b.predictedSales - a.predictedSales);

    /* ===============================
       FINAL RESPONSE
    =============================== */

    res.json({
      success: true,
      chart: chartData,
      products: productPredictions.slice(0, 10)
    });

  } catch (err) {

    console.error("Prediction error:", err);

    res.status(500).json({
      success: false,
      error: "Prediction failed"
    });

  }
});

export default router;