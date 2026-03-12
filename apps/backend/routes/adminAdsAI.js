import express from "express";
import Product from "../models/Product.js";
import AiAction from "../models/AiAction.js";

import { generateAds } from "../services/adsAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   AI ADS SUGGESTION
====================================================== */

router.get(
  "/ads-ai/:productId",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const product = await Product.findById(req.params.productId);

      if (!product) {
        return res.status(404).json({
          error: "Product not found"
        });
      }

      const ads = generateAds(product);

      const action = await AiAction.create({
        type: "ADS_CAMPAIGN",
        payload: {
          productId: product._id,
          ads
        }
      });

      res.json({
        success: true,
        suggestion: action
      });

    } catch (err) {

      console.error("Ads AI error:", err);

      res.status(500).json({
        error: "Ads suggestion failed"
      });

    }
  }
);

export default router;