import express from "express";
import { addConvertJob } from "../ai/queue/convertQueue.js";

const router = express.Router();

// POST /api/ai/convert
router.post("/convert", async (req, res) => {
  try {
    const { productId, imageUrl, mode } = req.body;

    if (!productId || !imageUrl) {
      return res
        .status(400)
        .json({ error: "Missing productId or imageUrl" });
    }

    const job = await addConvertJob(productId, imageUrl, mode || "preview");

    res.json({
      message: "Job added successfully",
      jobId: job.id,
    });
  } catch (error) {
    console.error("Error adding job:", error.message);
    res.status(500).json({ error: "Job creation failed" });
  }
});

export default router;
