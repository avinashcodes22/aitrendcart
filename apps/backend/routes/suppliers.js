import express from "express";
import * as meesho from "../services/suppliers/meesho.js";
import * as alibaba from "../services/suppliers/alibaba.js";
import * as indiamart from "../services/suppliers/indiamart.js";
import * as csv from "../services/suppliers/csv.js";

const router = express.Router();

const adapters = { meesho, alibaba, indiamart, csv };

router.get("/sync/:supplier", async (req, res) => {
  const { supplier } = req.params;
  const adapter = adapters[supplier];
  if (!adapter) return res.status(400).json({ error: "Unknown supplier" });

  try {
    const products = await adapter.fetchProducts({});
    res.json({ supplier, count: products.length, sample: products.slice(0, 2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sync failed", details: err.message });
  }
});

export default router;
