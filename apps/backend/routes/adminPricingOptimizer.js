import express from "express";
import { runPricingOptimizer } from "../services/pricingOptimizerAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN PRICING OPTIMIZER
POST /api/admin/run-pricing-optimizer
====================================
*/

router.post(
"/run-pricing-optimizer",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runPricingOptimizer();

    res.json({
      success:true,
      message:"Pricing optimizer completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Pricing optimizer failed"
    });

  }

});

export default router;