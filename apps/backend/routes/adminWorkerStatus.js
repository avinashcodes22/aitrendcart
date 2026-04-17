import express from "express";
import IORedis from "ioredis";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   REDIS CONNECTION
==================================== */

const redis = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null
  }
);

/* ====================================
   WORKER STATUS
   GET /api/admin/worker-status
==================================== */

router.get(
  "/worker-status",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const raw = await redis.get("ai_worker_status");

      /* ===============================
         NO DATA
      =============================== */

      if (!raw) {
        return res.json({
          status: "offline",
          processedJobs: 0,
          lastHeartbeat: null
        });
      }

      let worker;

      try {
        worker = JSON.parse(raw);
      }
      catch (parseError) {

        console.error(
          "Worker status parse error:",
          parseError.message
        );

        return res.json({
          status: "offline",
          processedJobs: 0,
          lastHeartbeat: null
        });
      }

      /* ===============================
         HEARTBEAT CHECK
      =============================== */

      const lastHeartbeat = worker.lastHeartbeat || 0;

      const lastSeen =
        Date.now() - lastHeartbeat;

      const online =
        lastSeen < 15000; // 15 seconds

      res.json({

        status: online ? "online" : "offline",

        processedJobs:
          worker.processedJobs || 0,

        lastHeartbeat:
          lastHeartbeat || null

      });

    }
    catch (err) {

      console.error(
        "Worker status error:",
        err.message
      );

      res.status(500).json({
        error: "Worker status failed"
      });

    }

  }
);

export default router;