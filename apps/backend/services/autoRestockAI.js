import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ======================================================
   AUTO RESTOCK ENGINE (Production Ready)
====================================================== */

export async function autoRestockAnalysis() {
  try {
    const THIRTY_DAYS_AGO = new Date();
    THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

    /* ===============================
       LOAD DATA
    =============================== */

    const orders = await Order.find({
      createdAt: { $gte: THIRTY_DAYS_AGO },
    }).lean();

    const products = await Product.find().lean();

    const salesMap = {};
    const seen = new Set();

    /* ===============================
       CALCULATE SALES PER PRODUCT
    =============================== */

    for (const order of orders) {
      for (const item of order.items) {
        const id = String(item.productId);

        if (!salesMap[id]) salesMap[id] = 0;

        salesMap[id] += item.quantity;
      }
    }

    const recommendations = [];

    /* ===============================
       RESTOCK LOGIC
    =============================== */

    for (const product of products) {
      const id = String(product._id);

      /* ===============================
         REMOVE DUPLICATES BY SLUG
      =============================== */

      if (!product.slug) continue;

      if (seen.has(product.slug)) continue;

      seen.add(product.slug);

      const monthlySales = salesMap[id] || 0;

      const dailyAverage = monthlySales / 30;

      /* ===============================
         DEMAND PREDICTION
      =============================== */

      const predictedNext30 = Math.round(
        dailyAverage * 30 * 1.25
      );

      const currentStock = product.stock ?? 0;

      const reorderQty = predictedNext30 - currentStock;

      /* ===============================
         ACTIONABLE CONDITION
      =============================== */

      if (reorderQty > 5) {
        recommendations.push({
          productId: product._id,
          productName: product.name,
          supplier: product.supplier || "Unknown",

          currentStock,
          monthlySales,
          predictedNext30,
          reorderQty,

          estimatedCost:
            reorderQty * (product.costPrice || product.price || 0),

          riskLevel:
            currentStock < 10
              ? "HIGH"
              : currentStock < 25
              ? "MEDIUM"
              : "LOW",
        });
      }
    }

    /* ===============================
       SORT BY PRIORITY
    =============================== */

    recommendations.sort(
      (a, b) => b.reorderQty - a.reorderQty
    );

    /* ===============================
       LIMIT RESULTS
    =============================== */

    return recommendations.slice(0, 5);

  } catch (err) {
    console.error("Restock AI error:", err);
    return [];
  }
}