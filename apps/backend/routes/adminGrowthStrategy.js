import express from "express";
import { runGrowthStrategy } from "../services/growthStrategyEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN AI GROWTH STRATEGY
==================================== */

router.post(
"/run-growth-strategy",
verifyToken,
requireRole("admin"),
async(req,res)=>{

  try{

    const result = await runGrowthStrategy();

    res.json({
      success:true,
      ...result
    });

  }
  catch(err){

    console.error("Growth strategy error:",err);

    res.status(500).json({
      error:"Growth strategy failed"
    });

  }

});

export default router;