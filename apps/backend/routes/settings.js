import express from "express";
import SystemSettings from "../models/SystemSettings.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ===============================
   GET SETTINGS
=============================== */
router.get("/settings", verifyToken, requireRole("admin"), async (req, res) => {

  try {

    let settings = await SystemSettings.findOne();

    if (!settings) {
      settings = await SystemSettings.create({
        aiEnabled: true,
        supplierAuto: true,
        securityMode: "normal",
        aiMode: "balanced" // 🔥 NEW
      });
    }

    res.json({
      success: true,
      settings
    });

  } catch (err) {

    console.error("Settings load error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to load settings"
    });

  }

});

/* ===============================
   UPDATE SETTINGS
=============================== */
router.post("/settings", verifyToken, requireRole("admin"), async (req, res) => {

  try {

    const {
      aiEnabled,
      supplierAuto,
      securityMode,
      aiMode // 🔥 NEW
    } = req.body;

    const updated = await SystemSettings.findOneAndUpdate(
      {},
      {
        aiEnabled,
        supplierAuto,
        securityMode,
        aiMode
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      settings: updated
    });

  } catch (err) {

    console.error("Settings update error:", err);

    res.status(500).json({
      success: false,
      error: "Failed to update settings"
    });

  }

});

export default router;