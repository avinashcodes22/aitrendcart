import Product from "../models/Product.js";
import Order from "../models/Order.js";

/* ====================================
   AI DYNAMIC PRICING ENGINE
==================================== */

export async function runDynamicPricing(){

  console.log("⚙️ Running AI Pricing Engine");

  const products = await Product.find();

  const results = [];

  for(const p of products){

    const orders = await Order.find({
      "items.productId":p._id
    });

    let sales = 0;

    for(const o of orders){
      for(const i of o.items){
        if(String(i.productId)===String(p._id)){
          sales += i.quantity;
        }
      }
    }

    const stock = p.stock || 0;
    const price = p.price || 0;

    let newPrice = price;

    /* ================================
       DEMAND ANALYSIS
    ================================ */

    if(sales > 20 && stock < 20){
      newPrice = Math.round(price * 1.15);
    }

    if(sales < 5 && stock > 50){
      newPrice = Math.round(price * 0.90);
    }

    results.push({

      productId:p._id,
      name:p.name,
      currentPrice:price,
      recommendedPrice:newPrice,
      sales,
      stock

    });

  }

  console.log("📊 Pricing analysis completed");

  return results;

}