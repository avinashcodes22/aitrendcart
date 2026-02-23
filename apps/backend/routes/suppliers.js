import express from "express";
import * as meesho from "../services/suppliers/meesho.js";
import * as alibaba from "../services/suppliers/alibaba.js";
import * as indiamart from "../services/suppliers/indiamart.js";
import * as csv from "../services/suppliers/csv.js";
import { normalizeProduct, upsertProducts } from "../services/adapter-base.js";
import Supplier from "../models/Supplier.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

const adapters = { meesho, alibaba, indiamart, csv };

// 🔐 GET /api/suppliers  → list suppliers (admin only)
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const list = await Supplier.find().lean();
    res.json(list);
  } catch (err) {
    console.error("Get suppliers error:", err.message);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
});

// 🔐 POST /api/suppliers/sync/:supplierKey  → trigger sync (admin only)
router.post(
  "/sync/:supplierKey",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { supplierKey } = req.params;
      const adapter = adapters[supplierKey];

      if (!adapter) {
        return res.status(400).json({ error: "Unknown supplier key" });
      }

      // find or create Supplier record
      let supplier = await Supplier.findOne({ key: supplierKey });
      if (!supplier) {
        supplier = await Supplier.create({
          key: supplierKey,
          name: supplierKey.toUpperCase(),
          type: supplierKey === "csv" ? "csv" : "api",
          status: "active",
        });
      }

      // fetch raw products from adapter (mock or real)
      const rawProducts = await adapter.fetchProducts(
        supplier.credentials || {}
      );

      // normalize products
      const normalized = rawProducts.map((p) =>
        normalizeProduct(p, supplierKey)
      );

      // save/update in MongoDB
      const { matched, upserted } = await upsertProducts(normalized);

      supplier.lastSync = new Date();
      supplier.productCount = supplier.productCount + upserted;
      await supplier.save();

      res.json({
        supplier: supplierKey,
        totalFetched: normalized.length,
        matched,
        upserted,
        sample: normalized.slice(0, 3),
      });
    } catch (err) {
      console.error("Sync error:", err.message);
      res.status(500).json({ error: "Sync failed", details: err.message });
    }
  }
);

export default router;
