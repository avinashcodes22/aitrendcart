import dotenv from "dotenv";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import { runStoreManager } from "../../services/storeManagerAI.js";
import { runPricingOptimizer } from "../../services/pricingOptimizerAI.js";
import { runMarketingAI } from "../../services/marketingAI.js";
import { runCommerceBrain } from "../../services/aiCommerceBrain.js";

// ✅ ADD THIS (IMPORTANT)
import AiPerformance from "../../models/AiPerformance.js";

dotenv.config();

/* ====================================
DATABASE
==================================== */

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ AI Master Worker MongoDB connected");

/* ====================================
REDIS
==================================== */

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

/* ====================================
HEARTBEAT
==================================== */

let isAlive = true;

setInterval(async () => {
  if (!isAlive) return;

  try {
    await connection.set(
      "ai:worker:status",
      JSON.stringify({
        status: "online",
        lastHeartbeat: Date.now(),
      }),
      "EX",
      5
    );
  } catch (err) {
    console.error("Heartbeat error:", err.message);
  }
}, 2000);

/* ====================================
WORKER
==================================== */

const worker = new Worker(
  "ai-master-queue",

  async (job) => {
    console.log("🧠 AI Master job:", job.name);

    const startTime = Date.now();

    try {
      switch (job.name) {
        case "store-manager":
          await runStoreManager();
          break;

        case "pricing-ai":
          await runPricingOptimizer();
          break;

        case "marketing-ai":
          await runMarketingAI();
          break;

        case "commerce-brain":
          await runCommerceBrain(job.data?.signals);
          break;

        default:
          console.log("⚠ Unknown AI job:", job.name);
      }

      const duration = Date.now() - startTime;

      // ✅ SAVE SUCCESS LOG
      await AiPerformance.create({
        engine: job.name,
        status: "success",
        duration,
        createdAt: new Date(),
      });

      console.log("✅ AI job finished");

    } catch (err) {
      const duration = Date.now() - startTime;

      // ❌ SAVE FAILURE LOG
      await AiPerformance.create({
        engine: job.name,
        status: "failed",
        duration,
        error: err.message,
        createdAt: new Date(),
      });

      console.error("❌ AI worker error:", err.message);
      throw err;
    }
  },

  { connection }
);

/* ====================================
GRACEFUL SHUTDOWN
==================================== */

process.on("SIGINT", async () => {
  console.log("🛑 Worker shutting down...");
  isAlive = false;
  await worker.close();
  process.exit(0);
});

console.log("🚀 AI Master Worker running");