import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI MARKETING ENGINE
==================================== */

export async function runMarketingAI(){

  console.log("📣 Running AI Marketing Engine...");

  const products = await Product
    .find()
    .sort({ arViews:-1 })
    .limit(10);

  for(const product of products){

    /* -----------------------------
       CREATE MARKETING SUGGESTION
    ------------------------------ */

    await AiDecision.create({

      type:"MARKETING_CAMPAIGN",

      entity:"PRODUCT",

      entityId:product._id,

      suggestion:{

        productName:product.name,

        campaignType:"instagram_ads",

        message:`🔥 Trending product: ${product.name}`,

        budget:1000

      },

      reason:`High engagement detected (AR views: ${product.arViews || 0})`

    });

    console.log("📈 Marketing suggestion:",product.name);

  }

  console.log("✅ Marketing AI finished");

}