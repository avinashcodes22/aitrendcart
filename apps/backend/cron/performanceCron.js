import cron from "node-cron";
import { evaluateProductPerformance } from "../services/aiPerformanceEngine.js";

/* ======================================================
   PERFORMANCE CRON
====================================================== */

export function startPerformanceCron() {

  console.log("⏰ Performance Cron Started");

  // Every 3 hours
  cron.schedule("0 */3 * * *", async () => {

    console.log("📊 Running Performance Engine...");

    try {

      await evaluateProductPerformance();

    } catch (err) {

      console.error("❌ Performance Cron Error:", err.message);

    }

  });

}