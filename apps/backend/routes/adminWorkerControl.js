import express from "express";
import { Queue } from "bullmq";
import IORedis from "ioredis";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { getWorkerStats } from "../services/workerMonitor.js";

const router = express.Router();

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const queue = new Queue("convert-queue", { connection });

/* =====================================================
   GET WORKER STATUS
===================================================== */

router.get(
  "/workers",
  verifyToken,
  requireRole("admin"),
  async (req,res)=>{

    const stats = await getWorkerStats();

    res.json({
      success:true,
      stats
    });

});

/* =====================================================
   PAUSE AI WORKERS
===================================================== */

router.post(
  "/workers/pause",
  verifyToken,
  requireRole("admin"),
  async (req,res)=>{

    await queue.pause();

    res.json({
      success:true,
      message:"Workers paused"
    });

});

/* =====================================================
   RESUME AI WORKERS
===================================================== */

router.post(
  "/workers/resume",
  verifyToken,
  requireRole("admin"),
  async (req,res)=>{

    await queue.resume();

    res.json({
      success:true,
      message:"Workers resumed"
    });

});

export default router;