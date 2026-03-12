import express from "express";
import { runViralPredictor } from "../services/viralPredictor.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN VIRAL PRODUCT PREDICTOR
==================================== */

router.post(
"/run-viral-predictor",
verifyToken,
requireRole("admin"),
async(req,res)=>{

  try{

    const result = await runViralPredictor();

    res.json({
      success:true,
      ...result
    });

  }
  catch(err){

    console.error("Viral predictor error:",err);

    res.status(500).json({
      error:"Viral predictor failed"
    });

  }

});

export default router;