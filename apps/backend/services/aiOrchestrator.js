import { runTrendPredictionNetwork } from "./aiTrendPredictionNetwork.js";
import { runTrendScanner } from "./trendScanner.js";
import { discoverSuppliersForProduct } from "./supplierDiscoveryEngine.js";
import { runProductLaunchEngine } from "./productLaunchEngine.js";

/* =====================================
   AI ORCHESTRATOR
   Coordinates all AI engines
===================================== */

export async function runAIOrchestrator() {

  try {

    console.log("🧠 Running AI Orchestrator");

    /* STEP 1 — DETECT TRENDS */

    await runTrendScanner();

    /* STEP 2 — PREDICT UPCOMING TRENDS */

    await runTrendPredictionNetwork();

    /* STEP 3 — DISCOVER SUPPLIERS */

    const trendingProducts = [
      "LED Sneakers",
      "Anime Hoodies",
      "RGB Gaming Chair"
    ];

    for (const name of trendingProducts) {

      await discoverSuppliersForProduct(name);

    }

    /* STEP 4 — ANALYZE PRODUCT LAUNCH */

    await runProductLaunchEngine();

    console.log("✅ AI Orchestrator finished");

  }
  catch (err) {

    console.error("AI Orchestrator error:", err.message);

  }

}