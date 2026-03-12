import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import {
  getProducts,
  getProductBySlug,
  createNewProduct,
  updateProduct,
  deleteProduct,
  toggleAR
} from "../controllers/productController.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

/* ADMIN */
router.post("/", verifyToken, requireRole("admin"), createNewProduct);
router.put("/:slug", verifyToken, requireRole("admin"), updateProduct);
router.delete("/:slug", verifyToken, requireRole("admin"), deleteProduct);
router.post("/:slug/ar", verifyToken, requireRole("admin"), toggleAR);

export default router;