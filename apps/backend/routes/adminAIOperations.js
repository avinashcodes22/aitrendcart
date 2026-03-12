import express from "express";
import AiPerformance from "../models/AiPerformance.js";
import AiDecision from "../models/AiDecision.js";
import AIError from "../models/AIError.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
AI OPERATIONS CENTER
GET /api/admin/ai-operations
====================================
*/

router.get(
"/ai-operations",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    /* ================================
       DECISION STATS
    ================================ */

    const decisionsPending =
      await AiDecision.countDocuments({status:"pending"});

    const decisionsApproved =
      await AiDecision.countDocuments({status:"approved"});

    const decisionsRejected =
      await AiDecision.countDocuments({status:"rejected"});

    /* ================================
       RECENT EXECUTIONS
    ================================ */

    const executions =
      await AiPerformance
        .find()
        .sort({createdAt:-1})
        .limit(20)
        .lean();

    /* ================================
       ENGINE FAILURE STATS
    ================================ */

    const engines = [
      "trendHarvester",
      "viralPredictor",
      "demandForecast",
      "competitorIntel",
      "customerBehavior",
      "marketingAutomation",
      "growthStrategy",
      "storeManagerCore"
    ];

    const engineHealth = [];

    for(const engine of engines){

      const failures =
        await AIError.countDocuments({
          engine,
          resolved:false
        });

      const lastRun =
        await AiPerformance
          .findOne({engine})
          .sort({createdAt:-1})
          .lean();

      engineHealth.push({
        engine,
        failures,
        lastRun:lastRun?.createdAt || null,
        success:lastRun?.success ?? null
      });

    }

    /* ================================
       RESPONSE
    ================================ */

    res.json({

      success:true,

      scheduler:"running",

      uptime:process.uptime(),

      decisions:{
        pending:decisionsPending,
        approved:decisionsApproved,
        rejected:decisionsRejected
      },

      engines:engineHealth,

      recentExecutions:executions

    });

  }
  catch(err){

    console.error("AI operations error:",err);

    res.status(500).json({
      success:false,
      error:"AI operations failed"
    });

  }

});

export default router;