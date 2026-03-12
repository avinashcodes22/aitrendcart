import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI PRICING OPTIMIZER
==================================== */

export async function runPricingOptimizer(){

  console.log("💰 Running Pricing Optimizer AI...");

  const products = await Product.find().limit(20);

  for(const product of products){

    const views = product.arViews || 0;
    const price = product.price || 0;

    /* --------------------------------
       HIGH DEMAND → INCREASE PRICE
    -------------------------------- */

    if(views > 60){

      const exists = await AiDecision.findOne({
        type:"PRICE_INCREASE",
        entityId:product._id.toString(),
        status:"pending"
      });

      if(!exists){

        const newPrice = Math.round(price * 1.08);

        await AiDecision.create({

          type:"PRICE_INCREASE",

          entity:"PRODUCT",

          entityId:product._id.toString(),

          suggestion:{
            productName:product.name,
            oldPrice:price,
            newPrice:newPrice,
            change:"+8%"
          },

          reason:`High product demand detected (${views} views)`

        });

        console.log("📈 Price increase suggestion:",product.name);

      }

    }

    /* --------------------------------
       LOW DEMAND → DISCOUNT
    -------------------------------- */

    if(views < 10){

      const exists = await AiDecision.findOne({
        type:"PRICE_DISCOUNT",
        entityId:product._id.toString(),
        status:"pending"
      });

      if(!exists){

        const newPrice = Math.round(price * 0.90);

        await AiDecision.create({

          type:"PRICE_DISCOUNT",

          entity:"PRODUCT",

          entityId:product._id.toString(),

          suggestion:{
            productName:product.name,
            oldPrice:price,
            newPrice:newPrice,
            change:"-10%"
          },

          reason:`Low engagement detected (${views} views)`

        });

        console.log("📉 Discount suggestion:",product.name);

      }

    }

  }

  console.log("✅ Pricing optimizer completed");

}