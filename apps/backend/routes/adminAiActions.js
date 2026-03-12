import express from "express";
import AiAction from "../models/AiAction.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ==========================================
   GET PENDING AI ACTIONS
========================================== */

router.get(
  "/ai-actions",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    const actions = await AiAction.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(actions);

  }
);

/* ==========================================
   APPROVE AI ACTION
========================================== */

router.post(
  "/ai-actions/:id/approve",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    const action = await AiAction.findById(req.params.id);

    if (!action) {
      return res.status(404).json({
        error: "Action not found"
      });
    }

    action.status = "approved";
    action.approvedBy = req.user.uid;

    await action.save();

    res.json({
      success: true
    });

  }
);

export default router;