import { Worker } from "bullmq";
import IORedis from "ioredis";
import axios from "axios";

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  }
);


// Worker will consume jobs from "convert-queue"
const worker = new Worker(
  "convert-queue",
  async (job) => {
    console.log("Processing job:", job.id);

    const { productId, imageUrl, mode } = job.data;

    // TEMP: if AI_SERVICE_URL is not set, just return a mock result
    if (!process.env.AI_SERVICE_URL) {
      console.log("No AI_SERVICE_URL set, returning mock result");
      return {
        productId,
        imageUrl,
        mode,
        status: "mock-success",
      };
    }

    const apiUrl = `${process.env.AI_SERVICE_URL}/generate3d`;

    const result = await axios.post(apiUrl, {
      productId,
      imageUrl,
      mode,
    });

    console.log("AI Response:", result.data);
    return result.data;
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed:`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} FAILED:`, err?.message);
});
