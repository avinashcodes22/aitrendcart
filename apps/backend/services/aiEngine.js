import { autoRestockAnalysis } from "./autoRestockAI.js";
import { inventoryInsights } from "./inventoryAI.js";
import { dynamicPricing } from "./dynamicPricingAI.js";

import { recordAiPerformance } from "./aiPerformanceMonitor.js";
import { aiSafetyGuard } from "./aiSafetyGuard.js";

/* 🔥 NEW (DO NOT REMOVE) */
import SystemSettings from "../models/SystemSettings.js";

/* ======================================================
AI ENGINE CORE
Collects signals from all AI systems
====================================================== */

export async function runAIAnalysis() {

const start = Date.now();

try {

/* ===============================
   🔥 LOAD SYSTEM SETTINGS
=============================== */

const settings = await SystemSettings.findOne();

/* 🚫 GLOBAL AI OFF */
if (!settings?.aiEnabled) {

  console.log("🚫 AI Engine Disabled from Settings");

  return {
    trends: [],
    demand: [],
    inventory: [],
    pricing: []
  };

}

/* ===============================
   RUN AI ENGINES IN PARALLEL
=============================== */

const [
restockSignals,
inventorySignals,
pricingSignals
] = await Promise.all([

autoRestockAnalysis(),
inventoryInsights(),
dynamicPricing()

]);

/* ===============================
   MERGE RESTOCK + INVENTORY
=============================== */

let combinedInventory = [
...(inventorySignals || []),
...(restockSignals || [])
];

/* ===============================
   🔥 SUPPLIER AUTO CONTROL
=============================== */

if (!settings?.supplierAuto) {

  combinedInventory = combinedInventory.filter(
    item => item.type !== "AUTO_RESTOCK"
  );

}

/* ===============================
   NORMALIZE OUTPUT
=============================== */

let signals = {

trends: [],
demand: [],
inventory: combinedInventory,
pricing: pricingSignals || []

};

/* ===============================
   🔐 SECURITY MODE CONTROL
=============================== */

if (settings?.securityMode === "high") {

  signals.pricing = signals.pricing.filter(
    p => p.confidence > 0.8
  );

}

/* ===============================
   AI SAFETY GUARD
=============================== */

await aiSafetyGuard("AI_ENGINE_CORE");

/* ===============================
   PERFORMANCE LOG
=============================== */

await recordAiPerformance({

engine: "AI_ENGINE_CORE",

executionTime: Date.now() - start,

decisionsCreated:
(combinedInventory?.length || 0) +
(pricingSignals?.length || 0)

});

return signals;

}
catch (err) {

console.error("AI Engine error:", err);

return {

trends: [],
demand: [],
inventory: [],
pricing: []

};

}

}