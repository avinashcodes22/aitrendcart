import express from "express";
import AiDecision from "../models/AiDecision.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { executeDecision } from "../services/aiExecutionEngine.js";

const router = express.Router();

/* ======================================
   GET AI DECISIONS
   /api/admin/ai-decisions?status=pending
====================================== */

router.get(
"/ai-decisions",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const status = req.query.status || "pending";

    const decisions = await AiDecision
      .find({ status })
      .sort({ createdAt:-1 })
      .limit(100);

    res.json({
      success:true,
      count:decisions.length,
      decisions
    });

  }
  catch(err){

    console.error("Fetch decisions error:",err);

    res.status(500).json({
      success:false,
      error:"Failed to load decisions"
    });

  }

});

/* ======================================
   APPROVE AI DECISION
====================================== */

router.post(
"/ai-decisions/:id/approve",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const decision = await AiDecision.findById(req.params.id);

    if(!decision){
      return res.status(404).json({
        success:false,
        error:"Decision not found"
      });
    }

    if(decision.status !== "pending"){
      return res.status(400).json({
        success:false,
        error:"Decision already processed"
      });
    }

    /* ------------------------------
       MARK APPROVED
    ------------------------------ */

    decision.status = "approved";
    decision.approvedBy = req.user.uid;
    decision.approvedAt = new Date();

    await decision.save();

    /* ------------------------------
       EXECUTE DECISION
    ------------------------------ */

    try{

      await executeDecision(decision._id);

    }
    catch(execError){

      console.error("Execution failed:",execError.message);

    }

    res.json({
      success:true,
      message:"Decision approved",
      decisionId:decision._id
    });

  }
  catch(err){

    console.error("Approve error:",err);

    res.status(500).json({
      success:false,
      error:"Approval failed"
    });

  }

});

/* ======================================
   REJECT AI DECISION
====================================== */

router.post(
"/ai-decisions/:id/reject",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const decision = await AiDecision.findById(req.params.id);

    if(!decision){
      return res.status(404).json({
        success:false,
        error:"Decision not found"
      });
    }

    if(decision.status !== "pending"){
      return res.status(400).json({
        success:false,
        error:"Decision already processed"
      });
    }

    decision.status = "rejected";
    decision.rejectedAt = new Date();

    await decision.save();

    res.json({
      success:true,
      message:"Decision rejected"
    });

  }
  catch(err){

    console.error("Reject error:",err);

    res.status(500).json({
      success:false,
      error:"Reject failed"
    });

  }

});

export default router;