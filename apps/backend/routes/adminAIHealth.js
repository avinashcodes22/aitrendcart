import express from "express";
import IORedis from "ioredis";
import mongoose from "mongoose";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

const redis = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

/*
====================================
AI HEALTH (CLEAN + NO SPAM)
====================================
*/

router.get(
  "/ai-health",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {

      /* =========================
         DB READY CHECK
      ========================= */
      if (mongoose.connection.readyState !== 1) {
        return res.json({
          worker: "offline",
          decisions: 0,
          failed: 0,
        });
      }

      /* =========================
         LOAD MODEL SAFELY
      ========================= */
      const AiPerformance =
        mongoose.models.AiPerformance ||
        mongoose.model("AiPerformance");

      /* =========================
         WORKER STATUS (REDIS)
      ========================= */
      let workerStatus = "offline";
      let lastHeartbeat = null;

      const workerRaw = await redis.get("ai:worker:status");

      if (workerRaw) {
        const parsed = JSON.parse(workerRaw);
        workerStatus = parsed.status;
        lastHeartbeat = parsed.lastHeartbeat;
      }

      /* =========================
         STATS
      ========================= */
      const totalJobs = await AiPerformance.countDocuments();
      const failedJobs = await AiPerformance.countDocuments({
        status: "failed",
      });

      /* ❌ REMOVED SPAM LOG */
      // console.log("🔥 TOTAL JOBS:", totalJobs);

      res.json({
        worker: workerStatus,
        lastHeartbeat,
        decisions: totalJobs,
        failed: failedJobs,
      });

    } catch (err) {
      console.error("AI health error:", err);

      res.status(500).json({
        error: "AI health failed",
      });
    }
  }
);

export default router;