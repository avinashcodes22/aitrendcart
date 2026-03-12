import express from "express";
import { runDynamicPricing } from "../services/dynamicPricingEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ====================================
   DEV TEST ROUTE (ADMIN ONLY)
==================================== */

router.get(
"/pricing-ai-test",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const result = await runDynamicPricing();

    res.json({
      success:true,
      result
    });

  }
  catch(err){

    console.error("Pricing AI test error:",err);

    res.status(500).json({
      success:false,
      error:"Pricing AI test failed"
    });

  }

});

/* ====================================
   RUN PRICING AI (PRODUCTION ROUTE)
==================================== */

router.post(
"/run-pricing-ai",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runDynamicPricing();

    res.json({
      success:true,
      message:"Pricing AI completed"
    });

  }
  catch(err){

    console.error("Pricing AI error:",err);

    res.status(500).json({
      success:false,
      error:"Pricing AI failed"
    });

  }

});

export default router;