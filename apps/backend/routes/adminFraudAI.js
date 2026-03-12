import express from "express";
import { runFraudDetection } from "../services/fraudDetection.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN FRAUD DETECTION
POST /api/admin/run-fraud-detection
====================================
*/

router.post(
"/run-fraud-detection",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runFraudDetection();

    res.json({
      success:true,
      message:"Fraud detection completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Fraud detection failed"
    });

  }

});

export default router;