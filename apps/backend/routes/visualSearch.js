import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* ----------------------------------
   VISUAL SEARCH (BASIC VERSION)
----------------------------------- */
router.post("/", async (req, res) => {
  try {
    const { category } = req.body;

    // TEMP: return similar category products
    // Later we add real AI similarity

    const products = await Product.find({
      category: category || { $exists: true }
    })
      .limit(10)
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Visual search error:", err.message);
    res.status(500).json({ error: "Visual search failed" });
  }
});

export default router;
