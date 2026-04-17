import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import LicenseReport from "../models/LicenseReport.js";

dotenv.config();
const router = express.Router();

const SERVICE_URL =
  process.env.LICENSE_SERVICE_URL || "http://localhost:8082";

/* ======================================
   VERIFY LICENSE
====================================== */

router.post("/verify", async (req, res) => {

  try {

    const { productId, imageUrl } = req.body;

    if (!imageUrl && !productId) {
      return res.status(400).json({
        error: "productId or imageUrl is required"
      });
    }

    let imgUrl = imageUrl;

    /* ===============================
       LOAD IMAGE FROM PRODUCT
    =============================== */

    if (!imgUrl && productId) {

      const product = await Product.findById(productId).lean();

      if (!product || !product.images?.length) {
        return res.status(400).json({
          error: "No image found for this product"
        });
      }

      imgUrl = product.images[0];
    }

    /* ===============================
       CALL LICENSE SERVICE
    =============================== */

    let data;

    try {

      const response = await axios.post(
        `${SERVICE_URL}/verify`,
        {
          productId,
          imageUrl: imgUrl
        },
        { timeout: 10000 }
      );

      data = response.data;

    } catch (serviceError) {

      console.error("License service error:", serviceError.message);

      /* fallback (prevents crash) */
      data = {
        flagged: false,
        confidence: 0.5,
        sources: [],
        reason: "Fallback response (service unavailable)"
      };
    }

    /* ===============================
       SAVE REPORT
    =============================== */

    const report = await LicenseReport.create({
      productId,
      imageUrl: imgUrl,
      flagged: data.flagged,
      confidence: data.confidence,
      sources: data.sources,
      reason: data.reason
    });

    /* ===============================
       UPDATE PRODUCT
    =============================== */

    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        licenseStatus: data.flagged ? "flagged" : "verified",
        licenseReportId: report._id
      });
    }

    res.json({
      ok: true,
      reportId: report._id,
      flagged: data.flagged,
      confidence: data.confidence,
      sources: data.sources,
      reason: data.reason
    });

  } catch (err) {

    console.error("License verify error:", err);

    res.status(500).json({
      error: "License verification failed"
    });

  }

});

/* ======================================
   GET REPORTS
====================================== */

router.get("/reports", async (req, res) => {

  try {

    const reports = await LicenseReport.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json(reports);

  } catch (err) {

    console.error("Get reports error:", err);

    res.status(500).json({
      error: "Failed to fetch reports"
    });

  }

});

export default router;