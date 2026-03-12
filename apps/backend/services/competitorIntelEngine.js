import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   SIMULATED COMPETITOR DATA
==================================== */

const competitorProducts = [

  {
    name:"LED Sneakers",
    platform:"amazon",
    price:1999
  },

  {
    name:"Anime Hoodies",
    platform:"flipkart",
    price:999
  },

  {
    name:"RGB Gaming Desk",
    platform:"meesho",
    price:5499
  }

];

/* ====================================
   COMPETITOR INTELLIGENCE ENGINE
==================================== */

export async function runCompetitorIntel(){

  console.log("🕵️ Running competitor intelligence...");

  let created = 0;

  for(const c of competitorProducts){

    try{

      const product = await Product.findOne({
        name:c.name
      });

      if(!product) continue;

      const ourPrice = product.price || 0;

      /* --------------------------------
         PRICE DIFFERENCE
      -------------------------------- */

      const diff = ourPrice - c.price;

      if(Math.abs(diff) < 100){
        continue;
      }

      await AiDecision.create({

        type:"COMPETITOR_PRICE_ALERT",

        entity:"PRODUCT",

        entityId:product._id.toString(),

        suggestion:{
          productName:product.name,
          ourPrice,
          competitorPrice:c.price,
          platform:c.platform,
          suggestedPrice:c.price - 50
        },

        reason:`Competitor price difference detected on ${c.platform}`

      });

      console.log(
        "⚠ Competitor price alert:",
        product.name
      );

      created++;

    }
    catch(err){

      console.error(
        "Competitor intel error:",
        err.message
      );

    }

  }

  console.log(
    `✅ Competitor scan complete. ${created} alerts`
  );

  return {
    alerts:created
  };

}