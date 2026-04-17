import { runTrendPredictionNetwork } from "./aiTrendPredictionNetwork.js";
import { runTrendScanner } from "./trendScanner.js";
import { discoverSuppliersForProduct } from "./supplierDiscoveryEngine.js";
import { runProductLaunchEngine } from "./productLaunchEngine.js";

import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* =====================================
   AI ORCHESTRATOR (SMART + SAFE)
===================================== */

export async function runAIOrchestrator() {

  try {

    console.log("🧠 Running AI Orchestrator");

    /* ===============================
       STEP 1 — DETECT TRENDS
    =============================== */

    await runTrendScanner();

    /* ===============================
       STEP 2 — PREDICT TRENDS
    =============================== */

    await runTrendPredictionNetwork();

    /* ===============================
       STEP 3 — GET REAL TRENDING PRODUCTS
    =============================== */

    const last7d = new Date(Date.now() - 7 * 86400000);

    const trends = await Order.aggregate([
      { $match: { createdAt: { $gte: last7d } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          sales: { $sum: "$items.quantity" }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    const trendingProducts = trends.map(t => t._id);

    console.log("🔥 Trending Products:", trendingProducts);

    /* ===============================
       STEP 4 — SUPPLIER DISCOVERY
       (WITH DUPLICATE + COOLDOWN)
    =============================== */

    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    const now = new Date();

    for (const name of trendingProducts) {

      /* 🔍 FIND EXISTING DECISION */
      const existing = await AiDecision.findOne({
        type: "SUPPLIER_IMPORT",
        "suggestion.productName": name
      }).sort({ createdAt: -1 });

      if (existing) {

        const timeDiff = now - new Date(existing.createdAt);

        /* ⛔ COOLDOWN CHECK */
        if (timeDiff < cooldownTime) {

          console.log(`⏭ Skipping (cooldown active): ${name}`);

          continue;
        }

      }

      /* 🚀 RUN SUPPLIER DISCOVERY */
      console.log(`🚀 Processing product: ${name}`);

      await discoverSuppliersForProduct(name);

    }

    /* ===============================
       STEP 5 — PRODUCT LAUNCH ENGINE
    =============================== */

    await runProductLaunchEngine();

    console.log("✅ AI Orchestrator finished");

  }
  catch (err) {

    console.error("AI Orchestrator error:", err.message);

  }

}