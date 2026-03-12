import { Queue } from "bullmq";
import IORedis from "ioredis";

/* =====================================================
   AI WORKER MONITOR
===================================================== */

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const queue = new Queue("convert-queue", { connection });

export async function getWorkerStats() {

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