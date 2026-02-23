// apps/backend/ai/workers/convertWorker.js
import { Worker } from "bullmq";
import IORedis from "ioredis";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../../models/Product.js";

dotenv.config();

// 🔗 Redis connection (BullMQ requires maxRetriesPerRequest = null)
const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  {
    maxRetriesPerRequest: null,
  }
);

// 🔗 Connect MongoDB in this worker process
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ [Worker] MongoDB connected");

    // 🧠 Create worker only after DB is ready
    const worker = new Worker(
      "convert-queue",
      async (job) => {
        const { productId, imageUrl, mode } = job.data;

        console.log("🧠 AI Job started:", job.id, mode);

        // 1) mark product as pending
        await Product.findByIdAndUpdate(productId, {
          conversionStatus: "pending",
          conversionMode: mode,
        });

        // 2) call AI microservice (Replit or other)
        const res = await axios.post(
          `${process.env.AI_SERVICE_URL}/generate3d`,
          { productId, imageUrl, mode },
          { timeout: 60000 }
        );

        const { modelUrl } = res.data;

        // 3) update product after success
        await Product.findByIdAndUpdate(productId, {
          model3dUrl: modelUrl,
          conversionStatus: "generated",
        });

        return { modelUrl };
      },
      { connection }
    );

    worker.on("completed", (job) => {
      console.log(`✅ AI Job ${job.id} completed`);
    });

    worker.on("failed", async (job, err) => {
      console.error(`❌ AI Job ${job?.id} failed`, err.message);
      if (job?.data?.productId) {
        await Product.findByIdAndUpdate(job.data.productId, {
          conversionStatus: "error",
        });
      }
    });
  })
  .catch((err) => {
    console.error("❌ [Worker] MongoDB error:", err.message);
  });
