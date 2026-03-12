import express from "express";
import { runPersonalShoppingAI } from "../services/personalShoppingAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN PERSONAL SHOPPING AI
POST /api/admin/run-personal-ai
====================================
*/

router.post(
"/run-personal-ai",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runPersonalShoppingAI();

    res.json({
      success:true,
      message:"Personal shopping AI completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Personal AI failed"
    });

  }

});

export default router;