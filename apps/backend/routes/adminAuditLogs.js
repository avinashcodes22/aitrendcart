import express from "express";
import AdminAuditLog from "../models/AdminAuditLog.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   GET ADMIN AUDIT LOGS
   GET /api/admin/audit
====================================================== */

router.get(
  "/audit",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const logs = await AdminAuditLog.find()
        .sort({ createdAt: -1 })
        .limit(200)
        .lean();

      res.json({
        success: true,
        logs,
      });
    } catch (err) {
      console.error("Audit logs error:", err);

      res.status(500).json({
        success: false,
        error: "Failed to load audit logs",
      });
    }
  }
);

export default router;