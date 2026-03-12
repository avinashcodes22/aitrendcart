import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI GROWTH STRATEGY ENGINE
==================================== */

export async function runGrowthStrategy(){

  console.log("📈 Running AI Growth Strategy...");

  const products = await Product.find().limit(100);

  let created = 0;

  for(const product of products){

    try{

      /* --------------------------------
         SALES COUNT
      -------------------------------- */

      const sales = await Order.countDocuments({
        "items.productId": product._id
      });

      const views = product.arViews || 0;

      /* --------------------------------
         STRATEGY: SCALE PRODUCT
      -------------------------------- */

      if(sales > 20){

        await AiDecision.create({

          type: "GROWTH_SCALE_PRODUCT",

          entity: "PRODUCT",

          entityId: product._id.toString(),

          suggestion:{
            productName: product.name,
            strategy: "Increase marketing budget",
            priority: "high"
          },

          reason: "High sales performance detected"

        });

        console.log("🚀 Growth opportunity:", product.name);

        created++;
        continue;

      }

      /* --------------------------------
         STRATEGY: DISCOUNT PRODUCT
      -------------------------------- */

      if(views > 30 && sales < 5){

        await AiDecision.create({

          type: "GROWTH_DISCOUNT_PRODUCT",

          entity: "PRODUCT",

          entityId: product._id.toString(),

          suggestion:{
            productName: product.name,
            strategy: "Apply promotional discount",
            suggestedDiscount: "10%"
          },

          reason: "High views but low conversion"

        });

        console.log("⚠ Conversion issue:", product.name);

        created++;
        continue;

      }

      /* --------------------------------
         STRATEGY: REMOVE PRODUCT
      -------------------------------- */

      if(views < 5 && sales === 0){

        await AiDecision.create({

          type: "GROWTH_REMOVE_PRODUCT",

          entity: "PRODUCT",

          entityId: product._id.toString(),

          suggestion:{
            productName: product.name,
            strategy: "Remove or replace product"
          },

          reason: "Very low engagement"

        });

        console.log("🗑 Low performance:", product.name);

        created++;

      }

    }
    catch(err){

      console.error(
        "Growth strategy error:",
        err.message
      );

    }

  }

  console.log(
    `✅ Growth strategy completed. ${created} strategies generated`
  );

  return {
    strategies: created
  };

}