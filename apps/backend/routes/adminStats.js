import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Supplier from "../models/Supplier.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { getWorkerStats } from "../services/workerMonitor.js";

const router = express.Router();

/* =====================================================
GET ADMIN STATS
GET /api/admin/stats
===================================================== */

router.get(
"/",
verifyToken,
requireRole("admin"),
async (req, res) => {

try {

  /* =============================
     TOTAL PRODUCTS
  ============================= */

  const totalProducts =
    await Product.countDocuments();

  /* =============================
     ORDERS TODAY
  ============================= */

  const start = new Date();
  start.setHours(0,0,0,0);

  const ordersToday =
    await Order.countDocuments({
      createdAt:{ $gte:start }
    });

  /* =============================
     ACTIVE SUPPLIERS
  ============================= */

  const activeSuppliers =
    await Supplier.countDocuments({
      status:"active"
    });

  /* =============================
     WORKER STATS
  ============================= */

  const workerStats =
    await getWorkerStats();

  const aiJobsRunning =
    workerStats.convert.active +
    workerStats.trend.active +
    workerStats.ai.active;

  res.json({
    ok:true,
    totalProducts,
    ordersToday,
    activeSuppliers,
    aiJobsRunning,
    workerStats
  });

}
catch(err){

  console.error(
    "Admin stats error:",
    err
  );

  res.status(500).json({
    ok:false,
    error:"Failed to load admin stats"
  });

}

}
);

export default router;
