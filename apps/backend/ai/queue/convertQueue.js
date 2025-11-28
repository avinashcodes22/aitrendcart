import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }
);


export const convertQueue = new Queue("convert-queue", { connection });

export async function addConvertJob(productId, imageUrl, mode) {
  return await convertQueue.add("convert-job", {
    productId,
    imageUrl,
    mode,
  });
}
