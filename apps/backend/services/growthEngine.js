import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI GROWTH ENGINE
==================================== */

export async function runGrowthEngine(){

  console.log("🚀 Running Growth Engine...");

  const products = await Product
    .find()
    .sort({ arViews:-1 })
    .limit(10);

  for(const product of products){

    await AiDecision.create({

      type:"GROWTH_STRATEGY",

      entity:"PRODUCT",

      entityId:product._id,

      suggestion:{

        productName:product.name,

        strategy:"cross_sell",

        recommendedBundle:[
          "Related Accessories",
          "Premium Version"
        ],

        discountSuggestion:10

      },

      reason:`Product has high engagement (AR views ${product.arViews || 0})`

    });

    console.log("📊 Growth idea generated:",product.name);

  }

  console.log("✅ Growth Engine finished");

}