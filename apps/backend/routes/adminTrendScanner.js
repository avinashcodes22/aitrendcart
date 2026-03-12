import express from "express";
import { harvestTrends } from "../services/trendHarvester.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN GLOBAL TREND SCANNER
   POST /api/admin/scan-trends
==================================== */

router.post(
"/scan-trends",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const start = Date.now();

    await harvestTrends();

    const duration = Date.now() - start;

    res.json({
      success:true,
      message:"Trend scan completed",
      executionTime:duration
    });

  }
  catch(err){

    console.error("Trend scan error:",err);

    res.status(500).json({
      success:false,
      error:"Trend scanner failed"
    });

  }

});

export default router;