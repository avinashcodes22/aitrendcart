import express from "express";
import { runDemandForecast } from "../services/demandForecastEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN DEMAND FORECAST
==================================== */

router.post(
"/run-demand-forecast",
verifyToken,
requireRole("admin"),
async(req,res)=>{

  try{

    const result = await runDemandForecast();

    res.json({
      success:true,
      ...result
    });

  }
  catch(err){

    console.error("Forecast error:",err);

    res.status(500).json({
      error:"Demand forecast failed"
    });

  }

});

export default router;