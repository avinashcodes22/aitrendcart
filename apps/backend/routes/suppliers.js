import express from "express";
import Supplier from "../models/Supplier.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import * as meesho from "../services/suppliers/meesho.js";
import * as alibaba from "../services/suppliers/alibaba.js";
import * as indiamart from "../services/suppliers/indiamart.js";
import * as csv from "../services/suppliers/csv.js";

import {
  normalizeProduct,
  upsertProducts
} from "../services/supplierAdapterBase.js";

const router = express.Router();

/* =========================================================
   REGISTER ADAPTERS
========================================================= */
const adapters = {
  meesho,
  alibaba,
  indiamart,
  csv
};

/* =========================================================
   ADMIN — LIST SUPPLIERS
   GET /api/suppliers
========================================================= */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ name: 1 }).lean();
    res.json(suppliers);
  } catch (err) {
    console.error("Supplier list error:", err.message);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

/* =========================================================
   ADMIN — ADD / UPDATE SUPPLIER
   POST /api/suppliers
========================================================= */
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const data = req.body;

    const supplier = await Supplier.findOneAndUpdate(
      { key: data.key },
      data,
      { upsert: true, new: true }
    );

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: "Failed to save supplier" });
  }
});

/* =========================================================
   ADMIN — SYNC SUPPLIER
   POST /api/suppliers/sync/:supplierKey
========================================================= */
router.post(
  "/sync/:supplierKey",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    const { supplierKey } = req.params;

    try {
      const adapter = adapters[supplierKey];

      if (!adapter || !adapter.fetchProducts) {
        return res.status(400).json({
          error: "Unknown supplier adapter"
        });
      }

      /* ===============================
         LOAD SUPPLIER RECORD
      =============================== */
      let supplier = await Supplier.findOne({ key: supplierKey });

      if (!supplier) {
        supplier = await Supplier.create({
          key: supplierKey,
          name: supplierKey.toUpperCase(),
          type: supplierKey === "csv" ? "csv" : "api",
          status: "active",
          productCount: 0,
          credentials: {}
        });
      }

      supplier.lastSyncStart = new Date();
      supplier.status = "syncing";
      await supplier.save();

      console.log("🔄 Sync started:", supplierKey);

      /* ===============================
         FETCH RAW PRODUCTS
      =============================== */
      const rawProducts = await adapter.fetchProducts(
        supplier.credentials || {}
      );

      if (!Array.isArray(rawProducts)) {
        throw new Error("Adapter returned invalid product list");
      }

      /* ===============================
         NORMALIZE
      =============================== */
      const normalized = rawProducts.map(p =>
        normalizeProduct(p, supplierKey)
      );

      /* ===============================
         UPSERT PRODUCTS
      =============================== */
      const { matched, upserted } =
        await upsertProducts(normalized);

      /* ===============================
         UPDATE SUPPLIER STATS
      =============================== */
      supplier.lastSync = new Date();
      supplier.status = "active";
      supplier.productCount =
        (supplier.productCount || 0) + upserted;

      await supplier.save();

      /* ===============================
         ADMIN NOTIFICATION
      =============================== */
      try {
        if (global.io) {
          global.io.emit("admin_notification", {
            title: "Supplier Sync Complete",
            message: `${supplierKey} imported ${upserted} products`,
            createdAt: new Date()
          });
        }
      } catch {}

      res.json({
        ok: true,
        supplier: supplierKey,
        totalFetched: normalized.length,
        matched,
        upserted,
        sample: normalized.slice(0, 3)
      });

    } catch (err) {
      console.error("❌ Supplier sync failed:", err.message);

      await Supplier.updateOne(
        { key: supplierKey },
        {
          status: "error",
          lastError: err.message
        }
      );

      res.status(500).json({
        error: "Sync failed",
        details: err.message
      });
    }
  }
);

/* =========================================================
   ADMIN — DELETE SUPPLIER
   DELETE /api/suppliers/:key
========================================================= */
router.delete("/:key", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    await Supplier.deleteOne({ key: req.params.key });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;