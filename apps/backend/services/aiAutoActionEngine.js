import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ======================================================
   AI AUTO ACTION ENGINE (SAFE VERSION)
====================================================== */

export async function runAutoActions() {

  console.log("🤖 Generating AI Actions (Approval Mode)");

  const products = await Product.find({
    aiGenerated: true
  });

  for (const p of products) {

    try {

      const status = p?.aiPerformance?.status;

      if (!status) continue;

      let actionType = null;
      let reason = "";

      /* =========================
         DECISION LOGIC
      ========================= */

      if (status === "scaling") {

        actionType = "scale_product";
        reason = "High performance detected";

      }

      else if (status === "stable") {

        actionType = "optimize_product";
        reason = "Stable performance";

      }

      else if (status === "dropping") {

        actionType = "stop_product";
        reason = "Low performance";

      }

      if (!actionType) continue;

      /* =========================
         PREVENT DUPLICATES
      ========================= */

      const existing = await AiDecision.findOne({
        "suggestion.productId": p._id,
        type: actionType,
        status: "pending"
      });

      if (existing) continue;

      /* =========================
         CREATE DECISION
      ========================= */

      await AiDecision.create({

        type: actionType,

        reason,

        status: "pending",

        suggestion: {
          productId: p._id,
          productName: p.name,
          currentPrice: p.price,
          stock: p.stock,
          performance: p.aiPerformance
        }

      });

      console.log(`🧠 Decision created: ${actionType} → ${p.name}`);

    } catch (err) {

      console.log("Auto action error:", err.message);

    }

  }

}