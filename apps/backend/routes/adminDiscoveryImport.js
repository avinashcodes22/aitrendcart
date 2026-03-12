import express from "express";
import Product from "../models/Product.js";

import { Queue } from "bullmq";
import IORedis from "ioredis";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { logAudit } from "../services/auditService.js";

import { generateProductContent } from "../services/contentAI.js";

const router = express.Router();

/* ===============================
   REDIS CONNECTION
================================ */

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const queue = new Queue("convert-queue", { connection });

/*
======================================================
POST /api/admin/discovery/import
Admin imports AI discovered product
======================================================
*/

router.post(
  "/discovery/import",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {

      const { name, price, supplier, stock } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Product name required",
        });
      }

      /* ===============================
         GENERATE PRODUCT ID
      =============================== */

      const productId = "ai-" + Date.now();

      /* ===============================
         BASE SLUG
      =============================== */

      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      let slug = baseSlug;
      let counter = 1;

      /* ===============================
         ENSURE UNIQUE SLUG
      =============================== */

      while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      /* ===============================
         AI CONTENT GENERATION
      =============================== */

      const aiContent = generateProductContent(name);

      /* ===============================
         CREATE PRODUCT
      =============================== */

      const product = await Product.create({
        productId,
        name,

        title: aiContent.title,
        description: aiContent.description,
        tags: aiContent.tags,

        price: price || 0,
        supplier: supplier || "ai-discovery",
        stock: stock || 0,

        slug,
        images: [],
        conversionStatus: "pending",
      });

      console.log("📦 Product imported:", product.name);

      /* ===============================
         ADD AI CONVERSION JOB
      =============================== */

      await queue.add("convert-product", {
        productId: product._id.toString(),
      });

      console.log("🤖 AI conversion job added");

      /* ===============================
         REALTIME ADMIN NOTIFICATION
      =============================== */

      const io = req.app.get("io");

      if (io) {
        io.emit("admin_notification", {
          type: "product",
          message: `📦 Product imported: ${product.name}`,
          createdAt: new Date(),
        });

        console.log("🔔 Notification emitted");
      }

      /* ===============================
         AUDIT LOG
      =============================== */

      await logAudit({
        userId: req.user?.uid || null,
        action: "PRODUCT_IMPORTED",
        entity: "PRODUCT",
        entityId: product._id.toString(),
        details: {
          productName: product.name,
          price: product.price,
          supplier: product.supplier,
        },
        req,
      });

      /* ===============================
         RESPONSE
      =============================== */

      res.json({
        success: true,
        product,
      });

    } catch (err) {

      console.error("Import error:", err);

      res.status(500).json({
        success: false,
        message: "Import failed",
      });

    }
  }
);

export default router;