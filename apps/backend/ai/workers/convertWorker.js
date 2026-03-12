import dotenv from "dotenv";
import mongoose from "mongoose";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import Product from "../../models/Product.js";

import { trackAIFailure } from "../../services/securityMonitor.js";

dotenv.config();

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
  { maxRetriesPerRequest: null }
);

/* ===============================
   WORKER
================================ */

const worker = new Worker(

  "convert-queue",

  async (job) => {

    try {

      const { productId } = job.data;

      const product =
        await Product.findById(productId);

      if (!product)
        throw new Error("Product not found");

      console.log(
        "⚙️ Generating 3D model:",
        product.name
      );

      /* simulate AI processing */

      await new Promise(r =>
        setTimeout(r, 3000)
      );

      product.model3dUrl =
        "/models/sample.glb";

      product.conversionStatus =
        "generated";

      await product.save();

      console.log(
        "✅ Generated:",
        product.name
      );

      return true;

    }

    catch (err) {

      console.error(
        "❌ AI job failure:",
        err.message
      );

      if (global.io) {
        trackAIFailure(global.io, job);
      }

      throw err;

    }

  },

  { connection }

);

console.log("🚀 BullMQ 3D Worker running");