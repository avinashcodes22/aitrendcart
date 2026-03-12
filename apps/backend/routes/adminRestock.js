import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { autoRestockAnalysis } from "../services/autoRestockAI.js";

const router = express.Router();

router.get(
  "/restock-ai",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const data = await autoRestockAnalysis();
    res.json(data);
  }
);

export default router;