import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { convertQueue } from "../ai/queue/convertQueue.js";
import { trendQueue } from "../ai/queue/trendQueue.js";

const router = express.Router();

/* =====================================
   RUN 3D CONVERSION JOB
===================================== */

router.post(
"/run-convert",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const { productId, imageUrl } = req.body;

    if(!productId){
      return res.status(400).json({
        error:"Missing productId"
      });
    }

    await convertQueue.add(
      "convert-job",
      { productId, imageUrl },
      { removeOnComplete:true }
    );

    res.json({
      success:true,
      message:"Conversion job added"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Failed to start job"
    });

  }

});

/* =====================================
   RUN TREND SCAN
===================================== */

router.post(
"/run-trend-scan",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await trendQueue.add(
      "trend-scan",
      {},
      { removeOnComplete:true }
    );

    res.json({
      success:true,
      message:"Trend scan started"
    });

  }
  catch(err){

    res.status(500).json({
      error:"Trend scan failed"
    });

  }

});

/* =====================================
   RUN TREND PREDICTION
===================================== */

router.post(
"/run-trend-predict",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    await trendQueue.add(
      "trend-predict",
      {},
      { removeOnComplete:true }
    );

    res.json({
      success:true,
      message:"Trend prediction started"
    });

  }
  catch(err){

    res.status(500).json({
      error:"Trend prediction failed"
    });

  }

});

export default router;