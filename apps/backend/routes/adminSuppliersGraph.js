import express from "express";
import Supplier from "../models/Supplier.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/* GET /api/admin/suppliers-graph */
router.get(
  "/",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {

    try {

      const suppliers = await Supplier.find().limit(20);

      const data = suppliers.map(s => ({
        name: s.name,
        products: Math.floor(Math.random()*20) + 5 // temporary
      }));

      res.json(data);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed" });
    }

  }
);

export default router;