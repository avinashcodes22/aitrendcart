import express from "express";
import { harvestTrends } from "../services/trendHarvester.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN TREND HARVESTER
POST /api/admin/harvest-trends
====================================
*/

router.post(
"/harvest-trends",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await harvestTrends();

    res.json({
      success:true,
      message:"Trend harvesting completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Trend harvesting failed"
    });

  }

});

export default router;