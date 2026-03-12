import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

/*
=====================================
AI REVENUE INSIGHTS
GET /api/admin/revenue-insights
=====================================
*/

router.get(
"/revenue-insights",
verifyToken,
requireRole("admin"),
async (req,res)=>{

  try{

    const today = new Date();
    today.setHours(0,0,0,0);

    /* -----------------------------
       ORDERS TODAY
    ----------------------------- */

    const ordersToday = await Order.find({
      createdAt:{ $gte: today }
    });

    const revenueToday =
      ordersToday.reduce(
        (sum,o)=>sum+o.amount,0
      );

    /* -----------------------------
       TOP PRODUCT
    ----------------------------- */

    const orders = await Order.find();

    const sales = {};

    for(const order of orders){

      for(const item of order.items){

        const id = item.productId.toString();

        sales[id] =
          (sales[id] || 0) + item.quantity;

      }

    }

    let topProduct = null;

    const sorted =
      Object.entries(sales)
        .sort((a,b)=>b[1]-a[1]);

    if(sorted.length>0){

      const productId = sorted[0][0];

      topProduct =
        await Product.findById(productId)
        .select("name price");

    }

    /* -----------------------------
       LOW STOCK PRODUCTS
    ----------------------------- */

    const lowStock =
      await Product.countDocuments({
        stock:{ $lt: 5 }
      });

    /* -----------------------------
       RESPONSE
    ----------------------------- */

    res.json({

      revenueToday,

      ordersToday: ordersToday.length,

      topProduct,

      lowStock

    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      error:"Revenue insights failed"
    });

  }

});

export default router;