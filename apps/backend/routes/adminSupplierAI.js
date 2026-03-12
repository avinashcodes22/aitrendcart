import express from "express";
import { analyzeSuppliers } from "../services/supplierIntelligence.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
RUN SUPPLIER INTELLIGENCE
POST /api/admin/analyze-suppliers
====================================
*/

router.post(
"/analyze-suppliers",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await analyzeSuppliers();

    res.json({
      success:true,
      message:"Supplier analysis completed"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Supplier analysis failed"
    });

  }

});

export default router;