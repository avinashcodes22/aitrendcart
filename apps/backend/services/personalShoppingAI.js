import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   PERSONAL SHOPPING ASSISTANT
==================================== */

export async function runPersonalShoppingAI(){

  console.log("🛍️ Running Personal Shopping AI...");

  /* --------------------------------
     ANALYZE PURCHASED PRODUCTS
  -------------------------------- */

  const orders = await Order.find().limit(100);

  const productFrequency = {};

  for(const order of orders){

    for(const item of order.items){

      productFrequency[item.productId] =
        (productFrequency[item.productId] || 0) + 1;

    }

  }

  const sortedProducts = Object.entries(productFrequency)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,5);

  for(const [productId,count] of sortedProducts){

    const product = await Product.findById(productId);

    if(!product) continue;

    const exists = await AiDecision.findOne({
      type:"PERSONAL_RECOMMENDATION",
      entityId:product._id.toString(),
      status:"pending"
    });

    if(exists) continue;

    await AiDecision.create({

      type:"PERSONAL_RECOMMENDATION",

      entity:"PRODUCT",

      entityId:product._id.toString(),

      suggestion:{
        productName:product.name,
        strategy:"recommend_to_users",
        popularityScore:count
      },

      reason:`Product frequently purchased (${count} orders)`

    });

    console.log("🛍️ Recommendation strategy:",product.name);

  }

  console.log("✅ Personal Shopping AI completed");

}