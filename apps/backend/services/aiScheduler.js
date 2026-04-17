import cron from "node-cron";

import { trendQueue } from "../ai/queue/trendQueue.js";

import { runStoreManager } from "./storeManagerAI.js";
import { runPricingOptimizer } from "./pricingOptimizerAI.js";
import { runMarketingAI } from "./marketingAI.js";
import { runAIAnalysis } from "./aiEngine.js";
import { runCommerceBrain } from "./aiCommerceBrain.js";
import { runAIOrchestrator } from "./aiOrchestrator.js";

/* ====================================
AI SCHEDULER
==================================== */

let commerceBrainRunning = false;

export function startAIScheduler(){

console.log("⏰ AI Scheduler started");

/* ====================================
STORE MANAGER EVERY HOUR
==================================== */

cron.schedule(
"0 * * * *",
async ()=>{

console.log("⏰ Running scheduled Store Manager");

try{

await runStoreManager();

}
catch(err){

console.error("Store Manager scheduler error",err);

}

},
{
timezone:"UTC"
}
);

/* ====================================
PRICING AI EVERY 3 HOURS
==================================== */

cron.schedule(
"0 */3 * * *",
async ()=>{

console.log("⏰ Running scheduled Pricing AI");

try{

await runPricingOptimizer();

}
catch(err){

console.error("Pricing scheduler error",err);

}

},
{
timezone:"UTC"
}
);

/* ====================================
TREND SCAN EVERY 6 HOURS
==================================== */

cron.schedule(
"0 */6 * * *",
async ()=>{

console.log("📈 Scheduling Trend Scan");

try{

await trendQueue.add(
"trend-scan",
{},
{
jobId:"trend-scan",
removeOnComplete:true,
removeOnFail:50
}
);

}
catch(err){

console.error("Trend scheduler error",err);

}

},
{
timezone:"UTC"
}
);

/* ====================================
TREND PREDICTION EVERY 12 HOURS
==================================== */

cron.schedule(
"0 */12 * * *",
async ()=>{

console.log("📈 Scheduling Trend Prediction");

try{

await trendQueue.add(
"trend-predict",
{},
{
jobId:"trend-predict",
removeOnComplete:true,
removeOnFail:50
}
);

}
catch(err){

console.error("Trend prediction scheduler error",err);

}

},
{
timezone:"UTC"
}
);

/* ====================================
MARKETING AI DAILY
==================================== */

cron.schedule(
"0 3 * * *",
async ()=>{

console.log("⏰ Running scheduled Marketing AI");

try{

await runMarketingAI();

}
catch(err){

console.error("Marketing scheduler error",err);

}

},
{
timezone:"UTC"
}
);

/* ====================================
AI COMMERCE BRAIN EVERY 2 HOURS
==================================== */

cron.schedule(
"0 */2 * * *",
async ()=>{

if(commerceBrainRunning){

console.log("⚠ Commerce Brain already running");
return;

}

commerceBrainRunning = true;

console.log("🧠 Running AI Commerce Brain");

try{

/* ===============================
   STEP 1 — ANALYZE SYSTEM
=============================== */
const signals = await runAIAnalysis();

/* ===============================
   STEP 2 — MAIN AI DECISION ENGINE
=============================== */
await runCommerceBrain(signals);

/* ===============================
   STEP 3 — EXECUTION LAYER (ORCHESTRATOR)
=============================== */
await runAIOrchestrator();

}
catch(err){

console.error("AI Commerce Brain scheduler error",err);

}
finally{

commerceBrainRunning = false;

}

},
{
timezone:"UTC"
}
);

}