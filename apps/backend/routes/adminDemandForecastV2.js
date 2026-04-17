import express from "express";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { runDemandForecastV2 } from "../services/demandForecastV2.js";

const router = express.Router();

/* ======================================================
   RUN DEMAND FORECAST V2
====================================================== */

router.post(
  "/demand-forecast-v2",
  verifyToken,
  requireRole("admin"),
  async (req,res)=>{

    try{

      const decisions = await runDemandForecastV2();

      res.json({
        success:true,
        decisions
      });

    }
    catch(err){

      console.error(err);

      res.status(500).json({
        success:false,
        error:"Demand Forecast failed"
      });

    }

  }
);

export default router;