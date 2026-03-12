import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   MARKETING AUTOMATION ENGINE
==================================== */

export async function runMarketingAutomation(){

  console.log("📣 Running marketing automation...");

  const products = await Product.find().limit(100);

  let created = 0;

  for(const product of products){

    try{

      const orders = await Order.countDocuments({
        "items.productId":product._id
      });

      const views = product.arViews || 0;

      /* --------------------------------
         HIGH INTEREST BUT LOW SALES
      -------------------------------- */

      if(views > 30 && orders < 5){

        await AiDecision.create({

          type:"MARKETING_CAMPAIGN",

          entity:"PRODUCT",

          entityId:product._id.toString(),

          suggestion:{
            productName:product.name,
            campaign:"Discount promotion",
            suggestedDiscount:"15%"
          },

          reason:"High interest but low conversions"

        });

        console.log("📣 Marketing opportunity:",product.name);

        created++;

      }

    }
    catch(err){

      console.error(
        "Marketing AI error:",
        err.message
      );

    }

  }

  console.log(
    `✅ Marketing analysis complete. ${created} campaigns suggested`
  );

  return {
    campaigns:created
  };

}