import express from "express";
import Notification from "../models/Notification.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* GET NOTIFICATIONS */
router.get(
  "/notifications",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const list = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(list);
  }
);

/* MARK AS READ */
router.post(
  "/notifications/read/:id",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true }
    );
    res.json({ ok: true });
  }
);

/* CREATE NOTIFICATION */
router.post("/notify", async (req, res) => {
  const io = req.app.get("io");

  const n = await Notification.create(req.body);

  io.emit("admin_notification", n);

  res.json({ ok: true });
});

export default router;