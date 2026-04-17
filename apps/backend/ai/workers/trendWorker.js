import dotenv from "dotenv";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import { runTrendScanner } from "../../services/trendScanner.js";
import { runTrendPredictionNetwork } from "../../services/aiTrendPredictionNetwork.js";

dotenv.config();

/* ===============================
DATABASE
================================ */

await mongoose.connect(process.env.MONGO_URI);

console.log("✅ Trend Worker MongoDB connected");

/* ===============================
REDIS
================================ */

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{
maxRetriesPerRequest:null,
enableReadyCheck:false
}
);

/* ===============================
WORKER
================================ */

const worker = new Worker(

"trend-queue",

async (job)=>{

console.log("📈 Trend job received:",job.name);

try{

if(!job?.name){
throw new Error("Invalid job payload");
}

/* ===============================
TREND SCAN
=============================== */

if(job.name==="trend-scan"){

await runTrendScanner();

}

/* ===============================
TREND PREDICTION
=============================== */

if(job.name==="trend-predict"){

await runTrendPredictionNetwork();

}

console.log("✅ Trend job finished");

}
catch(err){

console.error("❌ Trend worker error:",err.message);

throw err;

}

},

{
connection,

/* Prevent overload */

concurrency:2,

/* Job lock */

lockDuration:60000

}

);

console.log("🚀 Trend Worker running");

/* ===============================
EVENTS
================================ */

worker.on("completed",job=>{

console.log("🎉 Trend job completed:",job.id);

});

worker.on("failed",(job,err)=>{

console.log("💥 Trend job failed:",job?.id,err.message);

});
