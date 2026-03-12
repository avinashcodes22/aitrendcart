import express from "express";
import Product from "../models/Product.js";
import AiAction from "../models/AiAction.js";

import { generateMarketingEmail } from "../services/emailAI.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* ======================================================
   EMAIL CAMPAIGN SUGGESTION
====================================================== */

router.get(
  "/email-ai/:productId",
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

      const email = generateMarketingEmail(product);

      const action = await AiAction.create({
        type: "EMAIL_CAMPAIGN",
        payload: {
          productId: product._id,
          email
        }
      });

      res.json({
        success: true,
        suggestion: action
      });

    } catch (err) {

      console.error("Email AI error:", err);

      res.status(500).json({
        error: "Email suggestion failed"
      });

    }
  }
);

export default router;