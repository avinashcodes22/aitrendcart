import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

/* CONTROLLERS */
import {
  getProducts,
  getProductBySlug,
  createNewProduct,
  updateProduct,
  deleteProduct,
  toggleAR
} from "../controllers/productController.js";

const router = express.Router();

/* ===============================
   PUBLIC ROUTES
=============================== */

router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

/* ===============================
   ADMIN ROUTES
=============================== */

router.post(
  "/",
  verifyToken,
  requireRole("admin"),
  createNewProduct
);

router.put(
  "/:slug",
  verifyToken,
  requireRole("admin"),
  updateProduct
);

router.delete(
  "/:slug",
  verifyToken,
  requireRole("admin"),
  deleteProduct
)
export default router;