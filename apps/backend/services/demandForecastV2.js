import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

import { validateDecisionRisk } from "./aiDecisionRiskGuard.js";

/* ======================================================
   DEMAND FORECAST ENGINE V2
   Predict product demand using order history
====================================================== */

export async function runDemandForecastV2(){

  console.log("📊 Running Demand Forecast V2");

  const products = await Product.find().limit(100);

  const decisions = [];

  for(const product of products){

    const demand = await calculateDemand(product._id);

    if(demand < 5) continue;

    const draftDecision = {

      type:"STORE_RESTOCK",

      entity:"product",

      entityId:product._id,

      suggestion:{
        predictedDemand:demand,
        suggestedQuantity: Math.ceil(demand * 1.5)
      },

      reason:"Demand Forecast AI detected upcoming demand"

    };

    const risk = await validateDecisionRisk(draftDecision);

    if(!risk.valid) continue;

    const decision = await AiDecision.create(draftDecision);

    decisions.push(decision);

  }

  console.log("📦 Restock predictions:", decisions.length);

  return decisions;

}

/* ======================================================
   DEMAND CALCULATION
====================================================== */

async function calculateDemand(productId){

  const orders = await Order.find({
    "items.productId": productId
  });

  let total = 0;

  for(const order of orders){

    for(const item of order.items){

      if(String(item.productId) !== String(productId)) continue;

      total += item.quantity;

    }

  }

  return total / 7; // average weekly demand

}