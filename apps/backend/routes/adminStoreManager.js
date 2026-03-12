import express from "express";
import { runStoreManager } from "../services/storeManagerAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN AUTONOMOUS STORE MANAGER
POST /api/admin/run-store-manager
====================================
*/

router.post(
"/run-store-manager",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const result = await runStoreManager();

    res.json({
      success:true,
      message:"Store manager completed",
      report: result
    });

  }
  catch(err){

    console.error("Store manager error:",err);

    res.status(500).json({
      error:"Store manager failed"
    });

  }

});

export default router;