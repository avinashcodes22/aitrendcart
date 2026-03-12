import express from "express";
import { runCustomerIntelligence } from "../services/customerIntelligence.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN CUSTOMER INTELLIGENCE
POST /api/admin/run-customer-ai
====================================
*/

router.post(
"/run-customer-ai",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runCustomerIntelligence();

    res.json({
      success:true,
      message:"Customer intelligence completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Customer AI failed"
    });

  }

});

export default router;