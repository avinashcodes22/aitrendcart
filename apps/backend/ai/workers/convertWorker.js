import dotenv from "dotenv";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import Product from "../../models/Product.js";

dotenv.config();

let processedJobs = 0;
/* ===============================
DATABASE
================================ */

await mongoose.connect(process.env.MONGO_URI);

console.log("✅ Worker MongoDB connected");

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
JOB HANDLER
================================ */

async function handleConvertJob(job){

const { productId,imageUrl,mode } = job.data || {};

if(!productId){
throw new Error("Invalid job payload");
}

console.log("🧠 JOB RECEIVED:",job.id);

const product = await Product.findById(productId);

if(!product){
throw new Error("Product not found");
}

/* Prevent duplicate conversions */

if(product.conversionStatus==="generated"){

console.log("⚠ Already generated:",product.name);

return;

}

console.log("⚙️ Generating 3D model:",product.name);

product.conversionStatus="pending";

await product.save();

/* ===============================
Simulated AI processing
=============================== */

await new Promise(resolve=>setTimeout(resolve,3000));

product.model3dUrl="/models/sample.glb";

product.conversionStatus="generated";

product.aiGeneratedAt=new Date();

product.aiWorker="convert-worker";

await product.save();

console.log("✅ Generated:",product.name);

processedJobs++;

await connection.set(
  "ai_worker_status",
  JSON.stringify({
    processedJobs,
    lastHeartbeat: Date.now()
  })
);

return true;

}

/* ===============================
WORKER
================================ */

const worker = new Worker(

"convert-queue",

async (job)=>{

try{

if(job.name!=="convert-job"){

console.warn("⚠ Unknown job type:",job.name);

return;

}

return await handleConvertJob(job);

}
catch(err){

console.error("💥 Job failed:",job?.id,err.message);

throw err;

}

},

{
connection,

/* Worker concurrency */

concurrency:3,

/* Job timeout */

lockDuration:60000

}

);

console.log("🚀 BullMQ 3D Worker running");

/* ===============================
EVENTS
================================ */

worker.on("completed",job=>{

console.log("🎉 Job completed:",job.id);

});

worker.on("failed",(job,err)=>{

console.log("💥 Job failed:",job?.id,err.message);

});

worker.on("error", err => {

console.error("❌ Worker crashed:", err);

});

process.on("uncaughtException", err => {

console.error("💥 Uncaught exception:", err);

});

process.on("unhandledRejection", err => {

console.error("💥 Unhandled rejection:", err);

});

setInterval(async () => {
  await connection.set(
    "ai_worker_status",
    JSON.stringify({
      processedJobs,
      lastHeartbeat: Date.now()
    })
  );
}, 5000);