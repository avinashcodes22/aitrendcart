import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   DEMAND FORECAST ENGINE
==================================== */

export async function runDemandForecast(){

  console.log("📊 Running demand forecast...");

  const products = await Product.find().limit(100);

  let created = 0;

  for(const product of products){

    try{

      /* --------------------------------
         RECENT SALES
      -------------------------------- */

      const recentOrders = await Order.countDocuments({
        "items.productId":product._id
      });

      /* --------------------------------
         FORECAST DEMAND
      -------------------------------- */

      const predictedDemand =
        recentOrders + Math.floor(Math.random()*10);

      const stock = product.stock || 0;

      /* --------------------------------
         LOW STOCK RISK
      -------------------------------- */

      if(predictedDemand > stock){

        await AiDecision.create({

          type:"DEMAND_RESTOCK",

          entity:"PRODUCT",

          entityId:product._id.toString(),

          suggestion:{
            productName:product.name,
            currentStock:stock,
            predictedDemand,
            suggestedRestock:predictedDemand - stock + 5
          },

          reason:`Demand forecast exceeds stock`

        });

        console.log(
          "⚠ Demand risk:",
          product.name
        );

        created++;

      }

    }
    catch(err){

      console.error(
        "Forecast error:",
        product.name,
        err.message
      );

    }

  }

  console.log(
    `✅ Demand forecast complete. ${created} restock alerts`
  );

  return {
    alerts:created
  };

}