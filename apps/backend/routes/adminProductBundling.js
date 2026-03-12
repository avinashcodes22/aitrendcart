import express from "express";
import { runProductBundling } from "../services/productBundlingAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN PRODUCT BUNDLING AI
POST /api/admin/run-product-bundling
====================================
*/

router.post(
"/run-product-bundling",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await runProductBundling();

    res.json({
      success:true,
      message:"Product bundling AI completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Product bundling failed"
    });

  }

});

export default router;