import express from "express";
import AiAction from "../models/AiAction.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   AI PLATFORM CONTROL CENTER
====================================================== */

router.get(
  "/ai-control",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {

      const pending = await AiAction.countDocuments({ status: "pending" });
      const approved = await AiAction.countDocuments({ status: "approved" });
      const rejected = await AiAction.countDocuments({ status: "rejected" });

      res.json({
        pendingActions: pending,
        approvedActions: approved,
        rejectedActions: rejected
      });

    } catch (err) {

      console.error("AI control error:", err);

      res.status(500).json({
        error: "Control center failed"
      });

    }
  }
);

export default router;