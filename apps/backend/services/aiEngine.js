import { autoRestockAnalysis } from "./autoRestockAI.js";
import { inventoryInsights } from "./inventoryAI.js";
import { dynamicPricing } from "./dynamicPricingAI.js";

/* ======================================================
   AI ENGINE CORE
   Combines all AI systems into one analysis
====================================================== */

export async function runAIAnalysis() {
  try {
    const restock = await autoRestockAnalysis();
    const inventory = await inventoryInsights();
    const pricing = await dynamicPricing();

    return {
      restock,
      inventory,
      pricing
    };

  } catch (err) {

    console.error("AI Engine error:", err);

    return {
      restock: [],
      inventory: [],
      pricing: []
    };
  }
}