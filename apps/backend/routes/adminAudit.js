import express from "express";
import AuditLog from "../models/AuditLog.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* =====================================================
   GET AUDIT LOGS
===================================================== */

router.get(
"/audit",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const logs = await AuditLog
      .find()
      .sort({createdAt:-1})
      .limit(100)
      .lean();

    res.json({
      success:true,
      logs
    });

  }
  catch(err){

    console.error("Audit fetch error:",err);

    res.status(500).json({
      success:false
    });

  }

});

export default router;