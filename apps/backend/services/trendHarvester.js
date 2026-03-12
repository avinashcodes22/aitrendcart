import TrendProduct from "../models/TrendProduct.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   SIMULATED TREND SOURCES
==================================== */

const sampleTrends = [

  {
    name:"LED Sneakers",
    source:"tiktok",
    keywords:["led shoes","glow shoes"]
  },

  {
    name:"Anime Hoodies",
    source:"pinterest",
    keywords:["anime hoodie","streetwear anime"]
  },

  {
    name:"RGB Gaming Desk",
    source:"google",
    keywords:["rgb desk setup","gaming desk"]
  }

];

/* ====================================
   TREND HARVESTER ENGINE
==================================== */

export async function harvestTrends(){

  console.log("🌐 Harvesting trends...");

  let created = 0;

  for(const t of sampleTrends){

    try{

      /* --------------------------------
         DUPLICATE PROTECTION
      -------------------------------- */

      const exists = await TrendProduct.findOne({
        name:t.name
      });

      if(exists){

        console.log("⚠ Trend already exists:",t.name);
        continue;

      }

      /* --------------------------------
         CREATE TREND RECORD
      -------------------------------- */

      const score = Math.floor(Math.random()*100);

      const trend = await TrendProduct.create({

        name:t.name,
        source:t.source,
        keywords:t.keywords,
        score

      });

      console.log("📈 Trend stored:",trend.name);

      /* --------------------------------
         CREATE AI DECISION
         (ADMIN MUST APPROVE)
      -------------------------------- */

      await AiDecision.create({

        type:"TREND_PRODUCT",

        entity:"TREND_PRODUCT",

        entityId:trend._id.toString(),

        suggestion:{
          name:trend.name,
          source:trend.source,
          keywords:trend.keywords,
          score
        },

        reason:`Trending product detected from ${trend.source}`

      });

      console.log("🤖 AI decision created for:",trend.name);

      created++;

    }
    catch(err){

      console.error("Trend processing error:",t.name,err.message);

    }

  }

  console.log(`✅ Trend harvesting finished. ${created} new trends found.`);

  return {
    trendsCreated:created
  };

}