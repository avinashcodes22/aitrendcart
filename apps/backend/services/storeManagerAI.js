import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

import { harvestTrends } from "./trendHarvester.js";
import { runViralPredictor } from "./viralPredictor.js";
import { runDemandForecast } from "./demandForecastEngine.js";
import { runCompetitorIntel } from "./competitorIntelEngine.js";
import { runCustomerBehavior } from "./customerBehaviorEngine.js";
import { runMarketingAutomation } from "./marketingAutomationEngine.js";
import { runGrowthStrategy } from "./growthStrategyEngine.js";

import { checkAISafety } from "./aiSafetyGuard.js";
import { logAIExecution } from "./aiPerformanceMonitor.js";
import { logAIError } from "./aiErrorLogger.js";

import { trackAIFailure, shouldPauseEngine } from "./aiSelfHealing.js";

/* ====================================
   SAFE AI RUNNER
==================================== */

async function runAIEngine(name, fn, report) {

  try {

    const start = Date.now();

    await checkAISafety(name);

    report[name] = await fn();

    await logAIExecution(name, start);

  }
  catch (err) {

    await logAIExecution(name, Date.now(), err);
    await logAIError(name, err);

    const failures = await trackAIFailure(name);

    if (shouldPauseEngine(name)) {

      const io = global.io;

      if (io) {

        io.emit("security_alert", {
          type: "AI_ENGINE_PAUSED",
          message: `🚨 AI engine paused: ${name} (${failures} failures/min)`,
          createdAt: new Date()
        });

      }

      console.error(`AI engine paused: ${name}`);

    }

  }

}

/* ====================================
   AUTONOMOUS STORE MANAGER
==================================== */

export async function runStoreManager() {

  console.log("🏪 Running Autonomous Store Manager...");

  const report = {};

  /* ====================================
     SAFETY CHECK
  ==================================== */

  await checkAISafety("storeManagerCore");

  /* ====================================
     CORE PRODUCT MANAGEMENT
  ==================================== */

  const products = await Product
    .find()
    .sort({ arViews: -1 })
    .limit(10);

  for (const product of products) {

    const stock = product.stock || 0;
    const views = product.arViews || 0;

    try {

      /* RESTOCK SUGGESTION */

      if (stock < 5 && views > 20) {

        const exists = await AiDecision.findOne({
          type: "STORE_RESTOCK",
          entityId: product._id.toString(),
          status: "pending"
        });

        if (!exists) {

          await AiDecision.create({

            type: "STORE_RESTOCK",
            entity: "PRODUCT",
            entityId: product._id.toString(),

            suggestion: {
              productName: product.name,
              action: "restock",
              suggestedQuantity: 20
            },

            reason: `Low stock with high engagement (views ${views})`

          });

          console.log("📦 Restock suggestion:", product.name);

        }

      }

      /* PROMOTION SUGGESTION */

      if (views > 50) {

        const exists = await AiDecision.findOne({
          type: "STORE_PROMOTION",
          entityId: product._id.toString(),
          status: "pending"
        });

        if (!exists) {

          await AiDecision.create({

            type: "STORE_PROMOTION",
            entity: "PRODUCT",
            entityId: product._id.toString(),

            suggestion: {
              productName: product.name,
              campaign: "flash_sale",
              discount: 10
            },

            reason: `High engagement product (views ${views})`

          });

          console.log("🔥 Promotion suggestion:", product.name);

        }

      }

    }
    catch (err) {

      console.error("Store manager product error:", err.message);

    }

  }

  /* ====================================
     RUN AI ENGINES
  ==================================== */

  await runAIEngine("trendHarvester", harvestTrends, report);

  await runAIEngine("viralPredictor", runViralPredictor, report);

  await runAIEngine("demandForecast", runDemandForecast, report);

  await runAIEngine("competitorIntel", runCompetitorIntel, report);

  await runAIEngine("customerBehavior", runCustomerBehavior, report);

  await runAIEngine("marketingAutomation", runMarketingAutomation, report);

  await runAIEngine("growthStrategy", runGrowthStrategy, report);

  console.log("✅ Autonomous Store Manager completed");

  return report;

}