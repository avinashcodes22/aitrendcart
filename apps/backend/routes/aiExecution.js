import express from "express";

import AiExecution from "../models/AiExecution.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

router.get(
  "/ai-executions",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const executions = await AiExecution
        .find()
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      res.json({
        success: true,
        executions
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        error: "Failed to load executions"
      });

    }

  }
);

export default router;