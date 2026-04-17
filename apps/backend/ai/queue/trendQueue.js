import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{ maxRetriesPerRequest: null }
);

export const trendQueue = new Queue(
"trend-queue",
{ connection }
);

export async function addTrendScanJob(){

return trendQueue.add("trend-scan",{});

}

export async function addTrendPredictionJob(){

return trendQueue.add("trend-predict",{});

}
