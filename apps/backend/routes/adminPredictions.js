import express from "express";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { predictNext } from "../services/aiTrendPredictor.js";

const router = express.Router();

/* ======================================================
   GET REAL AI PREDICTIONS
   GET /api/admin/predictions
====================================================== */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    /* ===============================
       GROUP SALES BY PRODUCT
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

    /* ===============================
       RUN AI PREDICTION
    =============================== */
    const predictions = [];

    for (const name in historyMap) {
      const predicted = await predictNext(historyMap[name]);

      predictions.push({
        name,
        predictedSales: predicted,
        history: historyMap[name],
      });
    }

    predictions.sort((a, b) => b.predictedSales - a.predictedSales);

    res.json(predictions.slice(0, 10));

  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;