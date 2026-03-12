import express from "express";
import { runCompetitorIntel } from "../services/competitorIntelEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN COMPETITOR SCAN
==================================== */

router.post(
"/run-competitor-intel",
verifyToken,
requireRole("admin"),
async(req,res)=>{

  try{

    const result = await runCompetitorIntel();

    res.json({
      success:true,
      ...result
    });

  }
  catch(err){

    console.error("Competitor scan error:",err);

    res.status(500).json({
      error:"Competitor scan failed"
    });

  }

});

export default router;