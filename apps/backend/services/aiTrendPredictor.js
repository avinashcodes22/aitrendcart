import * as tf from "@tensorflow/tfjs";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

import { validateDecisionRisk } from "./aiDecisionRiskGuard.js";

/* ======================================================
   TRAIN MODEL (IMPROVED)
====================================================== */

export async function trainTrendModel(history) {

  if (!history || history.length < 3) return null;

  try {

    const xs = history.map((_, i) => i);
    const ys = history.map(h => Number(h.sales ?? h) || 0);

    const model = tf.sequential();

    model.add(tf.layers.dense({
      units: 12,
      inputShape: [1],
      activation: "relu"
    }));

    model.add(tf.layers.dense({ units: 6, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: "adam",
      loss: "meanSquaredError"
    });

    await model.fit(
      tf.tensor(xs),
      tf.tensor(ys),
      { epochs: 60, verbose: 0 }
    );

    return model;

  } catch (err) {
    console.error("Model training failed:", err);
    return null;
  }

}

/* ======================================================
   SMART FALLBACK (UPGRADED)
====================================================== */

function smartFallback(history) {

  const values = history.map(h => Number(h.sales ?? h) || 0);

  if (!values.length) return 5;

  const avg =
    values.reduce((a, b) => a + b, 0) / values.length;

  const recent = values.slice(-3);

  const momentum =
    recent.reduce((a, b) => a + b, 0) / recent.length;

  let trend = 0;

  if (values.length >= 2) {
    trend =
      (values[values.length - 1] - values[0]) /
      values.length;
  }

  let predicted =
    avg * 0.5 +
    momentum * 0.3 +
    trend * 0.2;

  return Math.max(5, Math.round(predicted * 1.5));
}

/* ======================================================
   PREDICT NEXT SALES (UPGRADED)
====================================================== */

export async function predictNext(history) {

  if (!history || history.length === 0) return 5;

  const clean = history.map(h =>
    typeof h === "number" ? h : h.sales || 0
  );

  /* 🔥 TREND BOOST */
  if (clean.length >= 3) {

    const last = clean[clean.length - 1];
    const avg =
      clean.reduce((a, b) => a + b, 0) / clean.length;

    if (last > avg * 1.3) {
      return Math.round(last * 1.2);
    }

  }

  /* 🔥 ML MODEL */
  if (clean.length >= 5) {

    const model = await trainTrendModel(clean);

    if (model) {
      try {

        const pred = model
          .predict(tf.tensor([clean.length]))
          .dataSync()[0];

        if (!isNaN(pred) && pred > 0) {
          return Math.round(pred);
        }

      } catch (err) {
        console.error("Prediction failed:", err);
      }
    }

  }

  return smartFallback(clean);
}

/* ======================================================
   BUILD SALES HISTORY (IMPROVED)
====================================================== */

async function buildSalesHistory(productId) {

  const orders = await Order.find({
    "items.productId": productId
  });

  const historyMap = {};

  for (const order of orders) {

    const day = new Date(order.createdAt)
      .toISOString()
      .slice(0, 10);

    for (const item of order.items) {

      if (String(item.productId) !== String(productId))
        continue;

      if (!historyMap[day]) historyMap[day] = 0;

      historyMap[day] += item.quantity;

    }

  }

  return Object.entries(historyMap).map(([day, sales]) => ({
    day,
    sales
  }));

}

/* ======================================================
   RUN AI TREND PREDICTOR (UNCHANGED + STABLE)
====================================================== */

export async function runTrendPredictor() {

  console.log("🧠 Running AI Trend Predictor");

  const products = await Product.find().limit(50);

  const decisions = [];

  for (const product of products) {

    const history = await buildSalesHistory(product._id);

    const prediction = await predictNext(history);

    if (prediction < 5) continue;

    const draftDecision = {

      type: "TREND_PRODUCT",
      entity: "product",
      entityId: product._id,

      suggestion: {
        productName: product.name,
        predictedDemand: prediction,
        history
      },

      reason: "AI detected upcoming demand trend"

    };

    const risk = await validateDecisionRisk(draftDecision);

    if (!risk.valid) continue;

    const decision = await AiDecision.create(draftDecision);

    decisions.push(decision);

  }

  console.log("📈 Trend predictions created:", decisions.length);

  return decisions;

}