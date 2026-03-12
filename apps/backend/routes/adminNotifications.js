import express from "express";
import AdminNotification from "../models/AdminNotification.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* GET /api/admin/notifications */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  const list = await AdminNotification.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(list);
});

/* POST /api/admin/notifications/read */
router.post("/read", verifyToken, requireRole("admin"), async (req, res) => {
  await AdminNotification.updateMany({}, { read: true });
  res.json({ ok: true });
});

export default router;