import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import SupplierOrder from "../models/SupplierOrder.js";
import Product from "../models/Product.js";

const router = express.Router();

/* ======================================================
   EXECUTE RESTOCK
   POST /api/admin/restock/execute
====================================================== */
router.post(
  "/restock/execute",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const { productId, reorderQty } = req.body;

      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ error: "Product not found" });

      const order = await SupplierOrder.create({
        productId,
        productName: product.name,
        supplier: product.supplier || "Unknown",
        quantity: reorderQty,
        estimatedCost:
          reorderQty * (product.costPrice || 0),
      });

      res.json({
        success: true,
        order,
      });
    } catch (err) {
      res.status(500).json({
        error: "Restock execution failed",
      });
    }
  }
);

export default router;