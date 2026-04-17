import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";
import AiExecution from "../models/AiExecution.js";
import SystemSettings from "../models/SystemSettings.js";

import { evaluateDecisionOutcome } from "./aiLearningLoop.js";

/* ====================================
AI EXECUTION ENGINE (WITH AI MODES)
==================================== */

export async function executeDecision(decisionId) {

  /* ====================================
  LOAD SETTINGS
  ==================================== */

  const settings = await SystemSettings.findOne();

  /* ====================================
  LOCK DECISION (ATOMIC)
  ==================================== */

  const decision = await AiDecision.findOneAndUpdate(
    {
      _id: decisionId,
      status: "approved",
      executed: false
    },
    {
      $set: {
        executed: true,
        executedAt: new Date()
      }
    },
    {
      new: true
    }
  );

  if (!decision) {
    console.log("⚠ Decision already executed or not approved");
    return;
  }

  console.log("⚙️ Executing decision:", decision.type);

  /* ====================================
  AI MODE CONTROL
  ==================================== */

  const risk = decision?.suggestion?.stockRisk || "medium";

  if (settings?.aiMode === "safe") {
    console.log("🛑 SAFE MODE → Execution blocked");
    return;
  }

  if (settings?.aiMode === "balanced") {
    if (risk === "high") {
      console.log("⚠ Balanced mode → High risk blocked");
      return;
    }
  }

  if (settings?.aiMode === "aggressive") {
    console.log("⚡ Aggressive mode → Executing");
  }

  /* ====================================
  CREATE EXECUTION TRACE
  ==================================== */

  const execution = await AiExecution.create({
    decisionId: decision._id,
    engine: decision.engine,
    action: decision.type,
    status: "running",
    startedAt: new Date()
  });

  try {

    let impact = {};

    switch (decision.type) {

      /* ================= PRICE ================= */

      case "PRICE_UPDATE":
      case "PRICE_INCREASE":
      case "PRICE_DISCOUNT": {

        const product = await Product.findById(decision.entityId);
        if (!product) throw new Error("Product not found");

        const oldPrice = product.price;
        const newPrice = decision.suggestion.newPrice;

        product.price = newPrice;
        await product.save();

        impact = {
          oldPrice,
          newPrice,
          change: newPrice - oldPrice
        };

        break;
      }

      /* ================= RESTOCK ================= */

      case "RESTOCK":
      case "STORE_RESTOCK": {

        const product = await Product.findById(decision.entityId);
        if (!product) throw new Error("Product not found");

        const oldStock = product.stock;
        const added = decision.suggestion.suggestedQuantity;

        product.stock += added;
        await product.save();

        impact = {
          oldStock,
          added,
          newStock: product.stock
        };

        break;
      }

      /* ================= PROMOTION ================= */

      case "STORE_PROMOTION": {

        const product = await Product.findById(decision.entityId);
        if (!product) throw new Error("Product not found");

        const oldDiscount = product.discount || 0;
        const newDiscount = decision.suggestion.discount;

        product.discount = newDiscount;
        await product.save();

        impact = {
          oldDiscount,
          newDiscount
        };

        break;
      }

      /* ================= 🔥 NEW: AUTO ACTIONS ================= */

      case "scale_product": {

        const product = await Product.findById(
          decision?.suggestion?.productId
        );

        if (!product) throw new Error("Product not found");

        const oldStock = product.stock;
        const oldPrice = product.price;

        product.stock += 50;
        product.price = Math.round(product.price * 1.05);

        await product.save();

        impact = {
          oldStock,
          newStock: product.stock,
          oldPrice,
          newPrice: product.price,
          action: "scaled"
        };

        break;
      }

      case "optimize_product": {

        const product = await Product.findById(
          decision?.suggestion?.productId
        );

        if (!product) throw new Error("Product not found");

        const oldPrice = product.price;

        product.price = Math.round(product.price * 1.02);

        await product.save();

        impact = {
          oldPrice,
          newPrice: product.price,
          action: "optimized"
        };

        break;
      }

      case "stop_product": {

        const product = await Product.findById(
          decision?.suggestion?.productId
        );

        if (!product) throw new Error("Product not found");

        product.isActive = false;

        await product.save();

        impact = {
          action: "stopped",
          productId: product._id
        };

        break;
      }

      /* ================= STRATEGY ================= */

      case "PRODUCT_BUNDLE":
      case "GLOBAL_EXPANSION":
      case "PERSONAL_RECOMMENDATION":

        impact = {
          note: "Strategy decision logged"
        };

        break;

      /* ================= DEFAULT ================= */

      default:

        impact = {
          warning: "No execution rule"
        };
    }

    /* ================= SUCCESS ================= */

    execution.status = "success";
    execution.result = "completed";
    execution.impact = impact;
    execution.completedAt = new Date();

    await execution.save();

    /* ================= AI LEARNING ================= */

    try {
      await evaluateDecisionOutcome(decision._id);
    } catch (err) {
      console.error("⚠ AI learning failed:", err.message);
    }

    console.log("✅ Decision executed");

  } catch (err) {

    execution.status = "failed";
    execution.result = err.message;
    execution.completedAt = new Date();

    await execution.save();

    console.error("❌ Execution error:", err.message);
    throw err;
  }
}