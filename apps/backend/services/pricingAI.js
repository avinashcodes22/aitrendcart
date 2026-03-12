import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI PRICING OPTIMIZATION ENGINE
==================================== */

export async function runPricingAI(){

  console.log("💰 Running Pricing AI...");

  const products = await Product.find().limit(50);

  for(const product of products){

    const orders = await Order.find({
      "items.productId": product._id
    });

    let sales = 0;

    for(const order of orders){

      const item = order.items.find(
        i => i.productId.toString() === product._id.toString()
      );

      if(item){
        sales += item.quantity;
      }

    }

    const price = product.price || 0;

    if(price === 0) continue;

    let suggestion = null;

    /* --------------------------------
       HIGH DEMAND → PRICE INCREASE
    -------------------------------- */

    if(sales > 20){

      const newPrice =
        Math.round(price * 1.10);

      suggestion = {

        action:"increase_price",
        currentPrice:price,
        suggestedPrice:newPrice

      };

    }

    /* --------------------------------
       LOW DEMAND → DISCOUNT
    -------------------------------- */

    else if(sales < 3){

      const newPrice =
        Math.round(price * 0.90);

      suggestion = {

        action:"decrease_price",
        currentPrice:price,
        suggestedPrice:newPrice

      };

    }

    if(!suggestion) continue;

    /* --------------------------------
       CREATE AI DECISION
    -------------------------------- */

    await AiDecision.create({

      type:"PRICE_OPTIMIZATION",

      entity:"PRODUCT",

      entityId:product._id,

      suggestion:{
        productName:product.name,
        ...suggestion
      },

      reason:`Sales analysis detected ${sales} units sold`

    });

    console.log("📊 Pricing suggestion:",product.name);

  }

  console.log("✅ Pricing AI finished");

}