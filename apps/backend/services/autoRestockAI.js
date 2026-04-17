import Order from "../models/Order.js";
import Product from "../models/Product.js";
import SystemSettings from "../models/SystemSettings.js";
import AiDecision from "../models/AiDecision.js";

/* ======================================================
AUTO RESTOCK ENGINE (ADMIN APPROVAL MODE)
====================================================== */

export async function autoRestockAnalysis() {

try {

/* ===============================
   LOAD SETTINGS
=============================== */

const settings = await SystemSettings.findOne();

if (!settings?.aiEnabled) {
  console.log("🚫 AutoRestock Skipped (AI Disabled)");
  return [];
}

if (!settings?.supplierAuto) {
  console.log("📦 Auto Restock Disabled from Settings");
  return [];
}

/* ===============================
   DATE RANGE
=============================== */

const THIRTY_DAYS_AGO = new Date();
THIRTY_DAYS_AGO.setDate(
  THIRTY_DAYS_AGO.getDate() - 30
);

/* ===============================
   LOAD DATA
=============================== */

const orders = await Order.find({
  createdAt: { $gte: THIRTY_DAYS_AGO }
}).lean();

const products = await Product.find().lean();

const salesMap = {};
const seen = new Set();

/* ===============================
   SALES MAP
=============================== */

for (const order of orders) {
  for (const item of order.items) {

    const id = String(item.productId);

    if (!salesMap[id]) {
      salesMap[id] = 0;
    }

    salesMap[id] += item.quantity;

  }
}

const recommendations = [];

/* ===============================
   RESTOCK ANALYSIS
=============================== */

for (const product of products) {

  if (!product.slug) continue;
  if (seen.has(product.slug)) continue;

  seen.add(product.slug);

  const id = String(product._id);

  const monthlySales = salesMap[id] || 0;
  const dailyAverage = monthlySales / 30;

  const predictedNext30 = Math.round(
    dailyAverage * 30 * 1.25
  );

  const currentStock = product.stock ?? 0;

  const reorderQty = predictedNext30 - currentStock;

  if (reorderQty <= 5) continue;

  const risk =
    currentStock < 10
      ? "high"
      : currentStock < 25
      ? "medium"
      : "low";

  const suggestion = {

    productId: product._id,
    productName: product.name,
    supplier: product.supplier || "Unknown",

    currentStock,
    monthlySales,
    predictedNext30,

    suggestedQuantity: reorderQty,
    stockRisk: risk

  };

  recommendations.push(suggestion);

}

/* ===============================
   SORT
=============================== */

recommendations.sort(
  (a, b) => b.suggestedQuantity - a.suggestedQuantity
);

const top = recommendations.slice(0, 5);

/* ===============================
   🔥 CREATE AI DECISIONS (IMPORTANT)
=============================== */

for (const r of top) {

  // avoid duplicate pending decisions
  const exists = await AiDecision.findOne({
    type: "RESTOCK",
    entityId: r.productId,
    status: "pending"
  });

  if (exists) continue;

  await AiDecision.create({

    type: "RESTOCK",
    entity: "PRODUCT",
    entityId: r.productId,

    suggestion: r,
    reason: `Stock risk: ${r.stockRisk}`,

    status: "pending"

  });

}

return top;

}
catch (err) {

console.error("Restock AI error:", err);
return [];

}

}