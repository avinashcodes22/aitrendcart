/* ======================================================
   AItrendcart Trend Analyzer Service

   Calculates AI opportunity scores for product discovery
====================================================== */

import Order from "../models/Order.js";
import Product from "../models/Product.js";

/* ======================================================
   DEMAND SCORE
   Based on order history
====================================================== */

export async function calculateDemandScore(productId) {
  try {
    const orders = await Order.find({
      "items.productId": productId,
    });

    let total = 0;

    for (const order of orders) {
      const item = order.items.find(
        (i) => i.productId.toString() === productId.toString()
      );

      if (item) total += item.quantity;
    }

    if (total === 0) return 1;

    if (total < 5) return 3;
    if (total < 10) return 5;
    if (total < 20) return 7;

    return 9;
  } catch (err) {
    console.error("Demand score error:", err);
    return 1;
  }
}

/* ======================================================
   TREND SCORE
   Based on product engagement
====================================================== */

export function calculateTrendScore(product) {
  const arViews = product.arViews || 0;

  if (arViews === 0) return 2;
  if (arViews < 20) return 4;
  if (arViews < 50) return 6;
  if (arViews < 100) return 8;

  return 9;
}

/* ======================================================
   MARGIN SCORE
   Based on profit potential
====================================================== */

export function calculateMarginScore(product) {
  const cost = product.supplierCost || product.price * 0.5;
  const price = product.price || 0;

  if (price === 0) return 1;

  const margin = ((price - cost) / price) * 100;

  if (margin < 10) return 2;
  if (margin < 20) return 4;
  if (margin < 30) return 6;
  if (margin < 50) return 8;

  return 9;
}

/* ======================================================
   FINAL OPPORTUNITY SCORE
====================================================== */

export function calculateOpportunityScore({
  trend,
  demand,
  margin,
}) {
  const score =
    trend * 0.4 +
    demand * 0.3 +
    margin * 0.3;

  return Number(score.toFixed(2));
}

/* ======================================================
   ANALYZE PRODUCT
====================================================== */

export async function analyzeProduct(product) {
  const demand = await calculateDemandScore(product._id);

  const trend = calculateTrendScore(product);

  const margin = calculateMarginScore(product);

  const opportunity = calculateOpportunityScore({
    trend,
    demand,
    margin,
  });

  return {
    trendScore: trend,
    demandScore: demand,
    marginScore: margin,
    opportunityScore: opportunity,
  };
}