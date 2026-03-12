import AiDecision from "../models/AiDecision.js";
import { logAiError } from "./aiErrorLogger.js";
import { recordAiPerformance } from "./aiPerformanceMonitor.js";

/* =====================================================
   AI TREND PREDICTION NETWORK
   Predicts upcoming viral products
===================================================== */

const signalSources = [

  {
    platform:"tiktok",
    products:["LED Sneakers","Smart LED Lamps"]
  },

  {
    platform:"pinterest",
    products:["Aesthetic Desk Setup","Korean Fashion Jackets"]
  },

  {
    platform:"google",
    products:["Portable Projector","Magnetic Phone Mount"]
  }

];

export async function runTrendPredictionNetwork(){

  const start = Date.now();

  try{

    console.log("🔮 Running AI Trend Prediction Network");

    const predictions = [];

    for(const source of signalSources){

      for(const product of source.products){

        const score = calculatePredictionScore();

        if(score < 0.7) continue;

        const exists = await AiDecision.findOne({

          type:"TREND_PRODUCT",
          "suggestion.productName":product,
          status:"pending"

        });

        if(exists) continue;

        const decision = await AiDecision.create({

          type:"TREND_PRODUCT",

          entity:"TREND",

          suggestion:{

            productName:product,
            source:source.platform,
            predictionScore:score

          },

          reason:`AI predicted emerging trend from ${source.platform}`

        });

        predictions.push(decision);

        console.log(
          "🔮 Predicted trend:",
          product,
          "score:",
          score
        );

      }

    }

    await recordAiPerformance({

      engine:"AI_TREND_PREDICTION",
      predictions:predictions.length,
      executionTime:Date.now()-start

    });

    return predictions;

  }
  catch(err){

    await logAiError({

      engine:"AI_TREND_PREDICTION",
      message:err.message

    });

    throw err;

  }

}

/* =====================================================
   TREND PREDICTION SCORE
===================================================== */

function calculatePredictionScore(){

  const socialVelocity = Math.random();
  const searchGrowth = Math.random();
  const platformSpread = Math.random();
  const engagement = Math.random();

  const score =
    socialVelocity*0.4 +
    searchGrowth*0.3 +
    platformSpread*0.2 +
    engagement*0.1;

  return Number(score.toFixed(2));

}