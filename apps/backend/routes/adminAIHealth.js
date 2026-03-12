import express from "express";
import AiPerformance from "../models/AiPerformance.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
AI HEALTH MONITOR
GET /api/admin/ai-health
====================================
*/

router.get(
"/ai-health",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const limit = parseInt(req.query.limit) || 50;
    const engine = req.query.engine || null;

    const query = {};

    if(engine){
      query.engine = engine;
    }

    const logs = await AiPerformance
      .find(query)
      .sort({ createdAt:-1 })
      .limit(limit)
      .lean();

    res.json({
      success:true,
      count:logs.length,
      logs
    });

  }
  catch(err){

    console.error("AI health fetch error:",err);

    res.status(500).json({
      success:false,
      error:"Failed to load AI health logs"
    });

  }

});

export default router;