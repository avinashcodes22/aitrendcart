import express from "express";
import Product from "../models/Product.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { logAudit } from "../services/auditService.js";

import { Queue } from "bullmq";
import IORedis from "ioredis";

const router = express.Router();

/* ===============================
   REDIS + AI CONVERSION QUEUE
=============================== */

const connection = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379",
  { maxRetriesPerRequest: null }
);

const queue = new Queue("convert-queue", { connection });

/* =====================================================
   AI PRODUCT DISCOVERY ENGINE
===================================================== */

router.get(
  "/discovery",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const products = await Product.find().limit(200).lean();

      const seen = new Set();
      const suggestions = [];

      for (const p of products) {

        if (!p.name) continue;

        const key = p.name.toLowerCase();

        if (seen.has(key)) continue;

        seen.add(key);

        const price = p.price || 0;
        const stock = p.stock || 0;
        const arViews = p.arViews || 0;
        const arPurchases = p.arPurchases || 0;

        const trendScore = Math.min(
          10,
          Math.round(arViews / 5 + 2)
        );

        const demandScore = Math.min(
          10,
          Math.round(arPurchases + Math.random() * 4)
        );

        const marginScore = Math.min(
          10,
          Math.round(price / 300)
        );

        const opportunityScore = Number(
          (
            trendScore * 0.35 +
            demandScore * 0.30 +
            marginScore * 0.35
          ).toFixed(1)
        );

        let label = "watch";

        if (opportunityScore >= 8) label = "viral";
        else if (opportunityScore >= 6) label = "rising";
        else if (opportunityScore >= 4) label = "stable";

        suggestions.push({

          id: p._id,
          name: p.name,
          price,
          stock,
          supplier: p.supplier || "unknown",

          trendScore,
          demandScore,
          marginScore,
          opportunityScore,

          label,
          arViews

        });

      }

      suggestions.sort(
        (a, b) => b.opportunityScore - a.opportunityScore
      );

      const result = suggestions.slice(0, 20);

      /* AUDIT LOG */

      await logAudit({

        userId: req.user?.uid || null,

        action: "AI_DISCOVERY_VIEWED",

        entity: "AI_ENGINE",

        details: {
          resultsReturned: result.length
        },

        req

      });

      res.json({
        success: true,
        products: result
      });

    }
    catch (err) {

      console.error("Discovery error:", err);

      res.status(500).json({
        success: false
      });

    }

  }
);

/* =====================================================
   IMPORT PRODUCT FROM AI DISCOVERY
===================================================== */

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
          message: "Product name required"
        });
      }

      /* ===============================
         GENERATE PRODUCT ID
      =============================== */

      const productId = "ai-" + Date.now();

      const baseSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      let slug = baseSlug;
      let counter = 1;

      while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      /* ===============================
         CREATE PRODUCT
      =============================== */

      const product = await Product.create({
        productId,
        name,
        price: price || 0,
        supplier: supplier || "ai-discovery",
        stock: stock || 0,
        slug,
        images: [],
        conversionStatus: "pending"
      });

      /* ===============================
         AI CONVERSION JOB
      =============================== */

      await queue.add("convert-product", {
        productId: product._id.toString()
      });

      /* ===============================
         ADMIN NOTIFICATION
      =============================== */

      const io = req.app.get("io");

      if (io) {

        io.emit("admin_notification", {
          type: "product",
          message: `📦 Product imported: ${product.name}`,
          createdAt: new Date()
        });

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
          supplier: product.supplier
        },

        req

      });

      res.json({
        success: true,
        product
      });

    }
    catch (err) {

      console.error("Import error:", err);

      res.status(500).json({
        success: false,
        message: "Import failed"
      });

    }

  }
);

export default router;