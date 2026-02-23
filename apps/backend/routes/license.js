// routes/license.js
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import LicenseReport from "../models/LicenseReport.js";

dotenv.config();
const router = express.Router();

const SERVICE_URL =
  process.env.LICENSE_SERVICE_URL || "http://localhost:8082";

// POST /api/license/verify
// body: { productId, imageUrl }
router.post("/verify", async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    if (!imageUrl && !productId) {
      return res
        .status(400)
        .json({ error: "productId or imageUrl is required" });
    }

    let imgUrl = imageUrl;

    // If only productId is given, try to load product and take first image
    if (!imgUrl && productId) {
      const product = await Product.findById(productId).lean();
      if (!product || !product.images || product.images.length === 0) {
        return res
          .status(400)
          .json({ error: "No image found for this product" });
      }
      imgUrl = product.images[0];
    }

    const payload = { productId, imageUrl: imgUrl };

    const response = await axios.post(`${SERVICE_URL}/verify`, payload, {
      timeout: 10000,
    });

    const data = response.data;

    // Save report
    const report = await LicenseReport.create({
      productId,
      imageUrl: imgUrl,
      flagged: data.flagged,
      confidence: data.confidence,
      sources: data.sources,
      reason: data.reason,
    });

    // Update product licenseStatus based on flagged
    if (productId) {
      await Product.findByIdAndUpdate(productId, {
        licenseStatus: data.flagged ? "flagged" : "verified",
        licenseReportId: report._id.toString(),
      });
    }

    res.json({
      ok: true,
      reportId: report._id,
      flagged: data.flagged,
      confidence: data.confidence,
      sources: data.sources,
      reason: data.reason,
    });
  } catch (err) {
  console.error("License verify error:", err.message);

  // Extra debug info:
  if (err.response) {
    console.error("Upstream response status:", err.response.status);
    console.error("Upstream response data:", err.response.data);
  } else if (err.request) {
    console.error("No response received from license service.");
  } else {
    console.error("Unexpected error:", err);
  }

  res.status(500).json({ error: "License verification failed" });
}

});

// GET /api/license/reports (for Admin listing)
router.get("/reports", async (req, res) => {
  try {
    const reports = await LicenseReport.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    res.json(reports);
  } catch (err) {
    console.error("Get reports error:", err.message);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

export default router;
