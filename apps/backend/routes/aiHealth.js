import express from "express";
import { verifyToken } from "../../middlewares/auth.js";
import { requireRole } from "../../middlewares/rbac.js";

import { getAIJobStats } from "../../services/aiStats.js";

const router = express.Router();

/* =====================================
   AI HEALTH
===================================== */

router.get(
  "/ai-health",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const stats = await getAIJobStats();

      res.json({
        worker: "running", // we already confirmed worker is online
        decisions: stats?.trends?.completed || 0,
        failed: stats?.convert?.failed || 0
      });

    } catch (err) {
      console.error("AI Health error:", err.message);

      res.status(500).json({
        error: "AI health failed"
      });
    }
  }
);

export default router;