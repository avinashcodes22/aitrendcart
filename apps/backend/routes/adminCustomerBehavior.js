import express from "express";
import { runCustomerBehavior } from "../services/customerBehaviorEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   RUN CUSTOMER BEHAVIOR ANALYSIS
==================================== */

router.post(
"/run-behavior-analysis",
verifyToken,
requireRole("admin"),
async(req,res)=>{

  try{

    const result = await runCustomerBehavior();

    res.json({
      success:true,
      ...result
    });

  }
  catch(err){

    console.error("Behavior analysis error:",err);

    res.status(500).json({
      error:"Behavior analysis failed"
    });

  }

});

export default router;