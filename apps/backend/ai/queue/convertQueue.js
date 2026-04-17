import { Queue } from "bullmq";
import IORedis from "ioredis";

/* ===============================
REDIS CONNECTION
================================ */

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379",
{
maxRetriesPerRequest: null,
enableReadyCheck: false
}
);

/* ===============================
CONVERSION QUEUE
================================ */

export const convertQueue = new Queue(
"convert-queue",
{ connection }
);

/* ===============================
ADD CONVERSION JOB
================================ */

export async function addConvertJob(
productId,
imageUrl,
mode
) {

return await convertQueue.add(

"convert-job",

{
  productId,
  imageUrl,
  mode
},

{
  /* Prevent duplicate jobs */

  jobId: `convert-${productId}`,

  /* Retry policy */

  attempts: 3,

  backoff: {
    type: "exponential",
    delay: 5000
  },

  /* Job timeout protection */

  timeout: 60000,

  /* Clean queue automatically */

  removeOnComplete: true,
  removeOnFail: false

}

);

}
