import express from "express";
import { runAIAnalysis } from "../services/aiEngine.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
=====================================================
GET AI INSIGHTS
/api/admin/ai/insights
=====================================================
*/

router.get(
  "/ai/insights",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const insights = await runAIAnalysis();

      res.json({
        success: true,
        insights,
      });
    } catch (err) {
      console.error("AI insights error:", err);

      res.status(500).json({
        error: "AI analysis failed",
      });
    }
  }
);

export default router;