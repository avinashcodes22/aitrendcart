import Order from "../models/Order.js";
import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   CUSTOMER BEHAVIOR ENGINE
==================================== */

export async function runCustomerBehavior(){

  console.log("🧠 Running customer behavior analysis...");

  const orders = await Order.find().limit(200);

  const productStats = {};

  /* --------------------------------
     ANALYZE PRODUCT PURCHASES
  -------------------------------- */

  for(const order of orders){

    for(const item of order.items){

      const id = String(item.productId);

      if(!productStats[id]){
        productStats[id] = {
          count:0,
          name:item.name
        };
      }

      productStats[id].count += item.quantity;

    }

  }

  /* --------------------------------
     FIND POPULAR PRODUCTS
  -------------------------------- */

  const sorted = Object.entries(productStats)
    .sort((a,b)=>b[1].count-a[1].count)
    .slice(0,5);

  let created = 0;

  for(const [productId,data] of sorted){

    try{

      const product = await Product.findById(productId);

      if(!product) continue;

      await AiDecision.create({

        type:"CUSTOMER_BEHAVIOR_UPSELL",

        entity:"PRODUCT",

        entityId:product._id.toString(),

        suggestion:{
          productName:product.name,
          purchaseCount:data.count,
          recommendation:"Feature this product in homepage or bundles"
        },

        reason:`High purchase frequency detected`

      });

      console.log("📊 Behavior insight:",product.name);

      created++;

    }
    catch(err){

      console.error(
        "Behavior analysis error:",
        err.message
      );

    }

  }

  console.log(
    `✅ Customer behavior analysis complete. ${created} insights`
  );

  return {
    insights:created
  };

}