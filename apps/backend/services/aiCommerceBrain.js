import AiDecision from "../models/AiDecision.js";
import { aiSafetyGuard } from "./aiSafetyGuard.js";
import { validateDecisionRisk } from "./aiDecisionRiskGuard.js";
import { logAiError } from "./aiErrorLogger.js";
import { recordAiPerformance } from "./aiPerformanceMonitor.js";

/* ==========================================================
   AI COMMERCE BRAIN
   Central intelligence layer for AItrendcart
========================================================== */

export async function runCommerceBrain(signals) {

  const start = Date.now();

  try {

    const decisions = [];

    const {
      trends = [],
      demand = [],
      pricing = [],
      inventory = []
    } = signals;

    /* =====================================================
       TREND → PRODUCT OPPORTUNITY
    ===================================================== */

    for (const trend of trends) {

      const score = calculateTrendScore(trend, demand);

      if (score < 0.6) continue;

      const draftDecision = {
        type: "TREND_PRODUCT",
        entity: "trend",
        suggestion: {
          productName: trend.productName,
          category: trend.category,
          score
        },
        reason: "AI Commerce Brain detected strong trend signal"
      };

      const validated = await processDecision(draftDecision);

      if (validated) decisions.push(validated);

    }

    /* =====================================================
       PRICING OPPORTUNITIES
    ===================================================== */

    for (const priceSignal of pricing) {

      if (!priceSignal.productId) continue;

      const draftDecision = {

        type: "PRICE_UPDATE",
        entity: "product",
        entityId: priceSignal.productId,
        suggestion: {
          newPrice: priceSignal.newPrice
        },
        reason: "AI Commerce Brain optimized pricing"

      };

      const validated = await processDecision(draftDecision);

      if (validated) decisions.push(validated);

    }

    /* =====================================================
       INVENTORY RESTOCK SIGNALS
    ===================================================== */

    for (const inv of inventory) {

      if (!inv.productId) continue;

      if (inv.stockRisk !== "high") continue;

      const draftDecision = {

        type: "STORE_RESTOCK",
        entity: "product",
        entityId: inv.productId,
        suggestion: {
          suggestedQuantity: inv.suggestedQuantity || 50
        },
        reason: "AI Commerce Brain detected inventory risk"

      };

      const validated = await processDecision(draftDecision);

      if (validated) decisions.push(validated);

    }

    /* =====================================================
       FINAL SAFETY GUARD
    ===================================================== */

    await aiSafetyGuard(decisions);

    /* =====================================================
       PERFORMANCE METRICS
    ===================================================== */

    await recordAiPerformance({
      engine: "AI_COMMERCE_BRAIN",
      decisionsCreated: decisions.length,
      executionTime: Date.now() - start
    });

    return decisions;

  }
  catch (err) {

    await logAiError({
      engine: "AI_COMMERCE_BRAIN",
      message: err.message
    });

    throw err;

  }

}

/* ==========================================================
   PROCESS DECISION
   Risk Guard → Save Decision
========================================================== */

async function processDecision(draftDecision){

  const risk = await validateDecisionRisk(draftDecision);

  if (!risk.valid) {

    console.log("⚠ Decision blocked by Risk Guard:", risk.reason);

    return null;

  }

  const decision = await AiDecision.create(draftDecision);

  return decision;

}

/* ==========================================================
   TREND SCORING
========================================================== */

function calculateTrendScore(trend, demandSignals) {

  let score = 0;

  if (trend.viralScore) {
    score += trend.viralScore * 0.4;
  }

  const demandSignal = demandSignals.find(
    d => d.productName === trend.productName
  );

  if (demandSignal) {
    score += demandSignal.demandScore * 0.4;
  }

  if (trend.socialMentions) {
    score += Math.min(trend.socialMentions / 10000, 0.2);
  }

  return Math.min(score, 1);

}