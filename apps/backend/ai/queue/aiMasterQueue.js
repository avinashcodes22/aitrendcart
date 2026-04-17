import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{ maxRetriesPerRequest:null }
);

export const aiMasterQueue = new Queue(
"ai-master-queue",
{ connection }
);

/* ====================================
JOB HELPERS
==================================== */

export async function addStoreManagerJob(){

return aiMasterQueue.add(
"store-manager",
{}
);

}

export async function addPricingJob(){

return aiMasterQueue.add(
"pricing-ai",
{}
);

}

export async function addMarketingJob(){

return aiMasterQueue.add(
"marketing-ai",
{}
);

}

export async function addCommerceBrainJob(signals){

return aiMasterQueue.add(
"commerce-brain",
{ signals }
);

}
