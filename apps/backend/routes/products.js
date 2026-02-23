import express from "express";
import Product from "../models/Product.js";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   PUBLIC — GET ALL PRODUCTS
   GET /api/products
====================================================== */
router.get("/", async (req, res) => {
  try {
    const { supplier, limit = 50 } = req.query;

    const query = {};
    if (supplier) query.supplier = supplier;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* ======================================================
   PUBLIC — GET PRODUCT BY SLUG
   GET /api/products/:slug
====================================================== */
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug
    }).lean();

    if (!product)
      return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

/* ======================================================
   ADMIN — CREATE PRODUCT
====================================================== */
router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.json(product);
    } catch (err) {
      console.error("Create product error:", err);
      res.status(500).json({ error: "Failed to create product" });
    }
  }
);

/* ======================================================
   ADMIN — UPDATE PRODUCT BY SLUG
====================================================== */
router.put(
  "/:slug",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await Product.findOneAndUpdate(
        { slug: req.params.slug },
        req.body,
        { new: true }
      );

      if (!product)
        return res.status(404).json({ error: "Product not found" });

      res.json(product);
    } catch (err) {
      console.error("Update product error:", err);
      res.status(500).json({ error: "Failed to update product" });
    }
  }
);

/* ======================================================
   ADMIN — DELETE PRODUCT BY SLUG
====================================================== */
router.delete(
  "/:slug",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      await Product.findOneAndDelete({ slug: req.params.slug });
      res.json({ ok: true });
    } catch (err) {
      console.error("Delete product error:", err);
      res.status(500).json({ error: "Failed to delete product" });
    }
  }
);

/* ======================================================
   ADMIN — TOGGLE AR PERMISSION BY SLUG
====================================================== */
router.post(
  "/:slug/ar",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { isARAllowed } = req.body;

      if (typeof isARAllowed !== "boolean") {
        return res.status(400).json({
          error: "isARAllowed must be true or false"
        });
      }

      const product = await Product.findOneAndUpdate(
        { slug: req.params.slug },
        { isARAllowed },
        { new: true }
      );

      if (!product)
        return res.status(404).json({ error: "Product not found" });

      res.json(product);
    } catch (err) {
      console.error("AR toggle error:", err);
      res.status(500).json({ error: "Failed to update AR setting" });
    }
  }
);

export default router;