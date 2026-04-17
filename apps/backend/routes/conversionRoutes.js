import express from "express";

import { convertProduct } from "../controllers/conversionController.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { aiLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

/* ===============================
ADMIN TRIGGER AI CONVERSION
================================ */

router.post(
"/convert/:slug",
verifyToken,
requireRole("admin"),
aiLimiter,
convertProduct
);

export default router;
