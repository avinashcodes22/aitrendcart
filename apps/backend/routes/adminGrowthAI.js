import express from "express";
import { runGrowthEngine } from "../services/growthEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN GROWTH ENGINE
POST /api/admin/run-growth-ai
====================================
*/

router.post(
"/run-growth-ai",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runGrowthEngine();

    res.json({
      success:true,
      message:"Growth engine completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Growth engine failed"
    });

  }

});

export default router;