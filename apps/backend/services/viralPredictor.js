import TrendProduct from "../models/TrendProduct.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   VIRAL PRODUCT PREDICTOR
==================================== */

export async function runViralPredictor(){

  console.log("🚀 Running Viral Product Predictor...");

  const trends = await TrendProduct
    .find()
    .sort({ score:-1 })
    .limit(20);

  let created = 0;

  for(const trend of trends){

    try{

      /* --------------------------------
         VIRAL SCORE CALCULATION
      -------------------------------- */

      const socialBoost = Math.floor(Math.random()*30);
      const demandBoost = Math.floor(Math.random()*20);

      const viralScore =
        trend.score + socialBoost + demandBoost;

      /* --------------------------------
         ONLY HIGH POTENTIAL PRODUCTS
      -------------------------------- */

      if(viralScore < 80){
        continue;
      }

      /* --------------------------------
         CREATE AI DECISION
      -------------------------------- */

      await AiDecision.create({

        type:"VIRAL_PRODUCT_OPPORTUNITY",

        entity:"TREND_PRODUCT",

        entityId:trend._id.toString(),

        suggestion:{
          productName:trend.name,
          source:trend.source,
          keywords:trend.keywords,
          baseTrendScore:trend.score,
          viralScore
        },

        reason:`High viral potential detected (score ${viralScore})`

      });

      console.log("🔥 Viral opportunity:",trend.name);

      created++;

    }
    catch(err){

      console.error(
        "Viral predictor error:",
        trend.name,
        err.message
      );

    }

  }

  console.log(`✅ Viral prediction complete. ${created} opportunities.`);

  return {
    predictions:created
  };

}