import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

/* ======================================================
   AI DISCOVERY FEED
====================================================== */

router.get("/", async (req, res) => {

  try {

    const products = await Product.find({
      stock: { $gt: 0 }
    })
      .limit(100)
      .lean();

    const ranked = products
      .map(p => {

        let score = 0;

        score += (p.arViews || 0) * 2;

        score += (p.arPurchases || 0) * 5;

        if (p.model3dUrl) score += 10;

        if (p.isARAllowed) score += 8;

        const freshness =
          (Date.now() - new Date(p.createdAt)) /
          (1000 * 60 * 60 * 24);

        if (freshness < 7) score += 6;

        return {
          ...p,
          discoveryScore: score
        };

      })
      .sort((a, b) => b.discoveryScore - a.discoveryScore)
      .slice(0, 40);

    res.json({
      success: true,
      products: ranked
    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      error: "Discovery feed failed"
    });

  }

});

export default router;