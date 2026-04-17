import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { runCommerceBrain } from "../services/aiCommerceBrain.js";

const router = express.Router();

/* =====================================================
   RUN AI COMMERCE BRAIN
===================================================== */

router.post(
  "/commerce-brain",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const decisions = await runCommerceBrain(req.body || {});

      res.json({
        success: true,
        decisions
      });

    }
    catch(err){

      console.error(err);

      res.status(500).json({
        success:false,
        error:"Commerce Brain failed"
      });

    }

  }
);

export default router;