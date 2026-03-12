import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
====================================
INVESTOR MODE DASHBOARD
GET /api/admin/investor-mode
====================================
*/

router.get(
"/investor-mode",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    /* TOTAL REVENUE */

    const orders = await Order.find();

    const revenue = orders.reduce(
      (sum,o)=>sum + (o.amount || 0),
      0
    );

    /* ORDER COUNT */

    const totalOrders = orders.length;

    /* PRODUCT COUNT */

    const products = await Product.countDocuments();

    /* AI ACTIVITY */

    const aiDecisions = await AiDecision.countDocuments();

    const aiApproved = await AiDecision.countDocuments({
      status:"approved"
    });

    /* SIMPLE GROWTH PROJECTION */

    const avgOrderValue =
      totalOrders > 0
      ? revenue / totalOrders
      : 0;

    const projectedMonthlyRevenue =
      avgOrderValue * totalOrders * 4;

    res.json({

      revenue,
      totalOrders,
      products,
      aiDecisions,
      aiApproved,

      avgOrderValue:Math.round(avgOrderValue),

      projectedMonthlyRevenue:Math.round(
        projectedMonthlyRevenue
      )

    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Investor dashboard failed"
    });

  }

});

export default router;