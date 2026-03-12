import cron from "node-cron";

import { runStoreManager } from "./storeManagerAI.js";
import { runPricingOptimizer } from "./pricingOptimizerAI.js";
import { harvestTrends } from "./trendHarvester.js";
import { runMarketingAI } from "./marketingAI.js";
import { runAIAnalysis } from "./aiEngine.js";
import { runCommerceBrain } from "./aiCommerceBrain.js";

/* ====================================
   AI SCHEDULER
==================================== */

export function startAIScheduler(){

  console.log("⏰ AI Scheduler started");

  /* ====================================
     STORE MANAGER EVERY HOUR
  ==================================== */

  cron.schedule("0 * * * *", async ()=>{

    console.log("⏰ Running scheduled Store Manager");

    try{
      await runStoreManager();
    }
    catch(err){
      console.error("Store Manager scheduler error",err);
    }

  });

  /* ====================================
     PRICING AI EVERY 3 HOURS
  ==================================== */

  cron.schedule("0 */3 * * *", async ()=>{

    console.log("⏰ Running scheduled Pricing AI");

    try{
      await runPricingOptimizer();
    }
    catch(err){
      console.error("Pricing scheduler error",err);
    }

  });

  /* ====================================
     TREND HARVESTER EVERY 6 HOURS
  ==================================== */

  cron.schedule("0 */6 * * *", async ()=>{

    console.log("⏰ Running scheduled Trend Harvester");

    try{
      await harvestTrends();
    }
    catch(err){
      console.error("Trend scheduler error",err);
    }

  });

  /* ====================================
     MARKETING AI DAILY
  ==================================== */

  cron.schedule("0 3 * * *", async ()=>{

    console.log("⏰ Running scheduled Marketing AI");

    try{
      await runMarketingAI();
    }
    catch(err){
      console.error("Marketing scheduler error",err);
    }

  });

  /* ====================================
     AI COMMERCE BRAIN (GLOBAL ANALYSIS)
     EVERY 2 HOURS
  ==================================== */

  cron.schedule("0 */2 * * *", async ()=>{

    console.log("🧠 Running AI Commerce Brain");

    try{

      const signals = await runAIAnalysis();

      await runCommerceBrain(signals);

    }
    catch(err){

      console.error("AI Commerce Brain scheduler error",err);

    }

  });

}