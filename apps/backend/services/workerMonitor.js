import { Queue } from "bullmq";
import IORedis from "ioredis";

/* =====================================================
AI WORKER MONITOR
===================================================== */

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{ maxRetriesPerRequest: null }
);

/* ====================================
QUEUES
==================================== */

const queues = {
convert: new Queue("convert-queue", { connection }),
trend: new Queue("trend-queue", { connection }),
ai: new Queue("ai-master-queue", { connection })
};

/* ====================================
GET QUEUE STATS
==================================== */

async function getQueueStats(queue) {

const waiting = await queue.getWaitingCount();
const active = await queue.getActiveCount();
const completed = await queue.getCompletedCount();
const failed = await queue.getFailedCount();

return {
waiting,
active,
completed,
failed
};

}

/* ====================================
GET WORKER STATS
==================================== */

export async function getWorkerStats() {

const convert = await getQueueStats(queues.convert);
const trend = await getQueueStats(queues.trend);
const ai = await getQueueStats(queues.ai);

return {
convert,
trend,
ai
};

}
