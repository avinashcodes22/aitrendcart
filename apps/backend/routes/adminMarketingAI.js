import express from "express";
import { runMarketingAI } from "../services/marketingAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN MARKETING AI
POST /api/admin/run-marketing-ai
====================================
*/

router.post(
"/run-marketing-ai",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runMarketingAI();

    res.json({
      success:true,
      message:"Marketing AI completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Marketing AI failed"
    });

  }

});

export default router;