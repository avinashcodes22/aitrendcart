import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { inventoryInsights } from "../services/inventoryAI.js";

const router = express.Router();

/* ======================================================
   GET INVENTORY AI
   GET /api/admin/inventory-ai
====================================================== */
router.get(
  "/inventory-ai",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const data = await inventoryInsights();
      res.json(data);
    } catch (err) {
      res.status(500).json({
        error: "Inventory AI failed",
      });
    }
  }
);

export default router;