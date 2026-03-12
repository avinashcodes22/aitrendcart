import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { stylePrediction } from "../services/customerStyleAI.js";

const router = express.Router();

router.get("/style-ai", verifyToken, async (req, res) => {
  const data = await stylePrediction(req.user.uid);
  res.json(data);
});

export default router;