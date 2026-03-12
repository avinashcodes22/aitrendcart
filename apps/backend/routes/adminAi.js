import express from "express";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ===============================
   REDIS CONNECTION
================================ */

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{ maxRetriesPerRequest: null }
);

const queue = new Queue("convert-queue", { connection });

/* ======================================================
   GET AI QUEUE STATUS
====================================================== */

router.get(
"/status",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const waiting = await queue.getWaitingCount();
const active = await queue.getActiveCount();
const completed = await queue.getCompletedCount();
const failed = await queue.getFailedCount();

res.json({
waiting,
active,
completed,
failed
});

}
catch(err){

console.error("AI status error:",err.message);

res.status(500).json({
error:"Failed to get AI status"
});

}

}
);

/* ======================================================
   GET FAILED JOBS
====================================================== */

router.get(
"/failed",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const jobs = await queue.getFailed(0,20);

res.json(

jobs.map(j=>({
id:j.id,
data:j.data,
failedReason:j.failedReason,
timestamp:j.timestamp
}))

);

}
catch(err){

res.status(500).json({
error:"Failed jobs fetch error"
});

}

}
);

/* ======================================================
   RETRY JOB
====================================================== */

router.post(
"/retry/:id",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const job = await queue.getJob(req.params.id);

if(!job){
return res.status(404).json({
error:"Job not found"
});
}

await job.retry();

res.json({ok:true});

}
catch{

res.status(500).json({
error:"Retry failed"
});

}

}
);

/* ======================================================
   REMOVE JOB
====================================================== */

router.delete(
"/remove/:id",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const job = await queue.getJob(req.params.id);

if(!job){
return res.status(404).json({
error:"Job not found"
});
}

await job.remove();

res.json({ok:true});

}
catch{

res.status(500).json({
error:"Remove failed"
});

}

}
);

export default router;