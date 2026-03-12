import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI STRATEGY ENGINE
==================================== */

export async function runAIStrategy(){

  console.log("🧠 Running AI Strategy Engine...");

  const products = await Product
    .find()
    .sort({ arViews:-1 })
    .limit(20);

  for(const product of products){

    const views = product.arViews || 0;
    const price = product.price || 0;
    const stock = product.stock || 0;

    /* ====================================
       PRICE INCREASE STRATEGY
    ==================================== */

    if(views > 80 && stock < 10){

      const newPrice = Math.round(price * 1.15);

      const exists = await AiDecision.findOne({
        type:"PRICE_INCREASE",
        entityId:product._id,
        status:"pending"
      });

      if(!exists){

        await AiDecision.create({

          type:"PRICE_INCREASE",

          entity:"PRODUCT",

          entityId:product._id,

          suggestion:{
            productName:product.name,
            currentPrice:price,
            newPrice
          },

          reason:"High demand product with limited stock"

        });

        console.log("📈 Strategy: price increase",product.name);

      }

    }

    /* ====================================
       DISCOUNT STRATEGY
    ==================================== */

    if(views < 10 && stock > 20){

      const newPrice = Math.round(price * 0.9);

      const exists = await AiDecision.findOne({
        type:"PRICE_DISCOUNT",
        entityId:product._id,
        status:"pending"
      });

      if(!exists){

        await AiDecision.create({

          type:"PRICE_DISCOUNT",

          entity:"PRODUCT",

          entityId:product._id,

          suggestion:{
            productName:product.name,
            currentPrice:price,
            newPrice
          },

          reason:"Low demand product with high stock"

        });

        console.log("📉 Strategy: discount",product.name);

      }

    }

  }

  console.log("✅ AI Strategy Engine completed");

}