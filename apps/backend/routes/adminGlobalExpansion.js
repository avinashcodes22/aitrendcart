import express from "express";
import { runGlobalExpansion } from "../services/globalExpansionEngine.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN GLOBAL EXPANSION AI
POST /api/admin/run-global-expansion
====================================
*/

router.post(
"/run-global-expansion",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runGlobalExpansion();

    res.json({
      success:true,
      message:"Global expansion analysis completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Global expansion failed"
    });

  }

});

export default router;