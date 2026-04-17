import express from "express";
import { verifyToken } from "../middlewares/auth.js";

import { generatePersonalizedFeed } from "../services/personalizationEngine.js";

const router = express.Router();

/* =====================================================
   PERSONALIZED DISCOVERY FEED
===================================================== */

router.get("/", verifyToken, async (req, res) => {

  try {

    const userId = req.user.uid;

    const products =
      await generatePersonalizedFeed(userId);

    res.json({
      success: true,
      products
    });

  }
  catch(err){

    console.error("Personalized feed error:", err);

    res.status(500).json({
      success:false,
      error:"Personalized feed failed"
    });

  }

});

export default router;