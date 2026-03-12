import express from "express";

import AiDecision from "../models/AiDecision.js";
import AiPerformance from "../models/AiPerformance.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
AI STRATEGY DASHBOARD DATA
GET /api/admin/ai-strategy
====================================
*/

router.get(
"/ai-strategy",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    /* ===============================
       DECISION COUNTS
    =============================== */

    const pending =
      await AiDecision.countDocuments({status:"pending"});

    const approved =
      await AiDecision.countDocuments({status:"approved"});

    const rejected =
      await AiDecision.countDocuments({status:"rejected"});

    /* ===============================
       RECENT AI EXECUTIONS
    =============================== */

    const executions =
      await AiPerformance
        .find()
        .sort({createdAt:-1})
        .limit(10)
        .lean();

    /* ===============================
       EXECUTION SUMMARY
    =============================== */

    const successfulRuns =
      await AiPerformance.countDocuments({success:true});

    const failedRuns =
      await AiPerformance.countDocuments({success:false});

    /* ===============================
       RESPONSE
    =============================== */

    res.json({

      success:true,

      decisions:{
        pending,
        approved,
        rejected
      },

      executionStats:{
        success:successfulRuns,
        failed:failedRuns
      },

      recentAIExecutions:executions

    });

  }
  catch(err){

    console.error("AI strategy dashboard error:",err);

    res.status(500).json({
      success:false,
      error:"AI strategy dashboard failed"
    });

  }

});

export default router;