import AiDecision from "../models/AiDecision.js";
import Product from "../models/Product.js";

/* =====================================================
   AI DECISION RISK GUARD
   Protects system from dangerous AI suggestions
===================================================== */

export async function validateDecisionRisk(decision){

  try{

    switch(decision.type){

      /* =========================================
         PRICE UPDATE VALIDATION
      ========================================= */

      case "PRICE_UPDATE":
      case "PRICE_INCREASE":
      case "PRICE_DISCOUNT":

        const product = await Product.findById(decision.entityId);

        if(!product){
          return reject("Product not found");
        }

        const oldPrice = product.price;
        const newPrice = decision.suggestion?.newPrice;

        if(!newPrice){
          return reject("Missing new price");
        }

        const changePercent =
          Math.abs(newPrice - oldPrice) / oldPrice;

        if(changePercent > 0.5){

          return reject(
            "Price change exceeds 50%"
          );

        }

        break;

      /* =========================================
         RESTOCK VALIDATION
      ========================================= */

      case "STORE_RESTOCK":

        const qty = decision.suggestion?.suggestedQuantity;

        if(!qty){
          return reject("Missing restock quantity");
        }

        if(qty > 5000){

          return reject(
            "Restock quantity too large"
          );

        }

        break;

      /* =========================================
         TREND PRODUCT VALIDATION
      ========================================= */

      case "TREND_PRODUCT":

        if(!decision.suggestion?.productName){

          return reject(
            "Trend product missing name"
          );

        }

        break;

    }

    /* =========================================
       DUPLICATE DECISION CHECK
    ========================================= */

    const existing = await AiDecision.findOne({
      type:decision.type,
      entityId:decision.entityId,
      status:"pending"
    });

    if(existing){

      return reject(
        "Duplicate pending decision"
      );

    }

    return {
      valid:true
    };

  }
  catch(err){

    console.error(
      "AI Risk Guard error:",
      err.message
    );

    return {
      valid:false,
      reason:"Risk guard failure"
    };

  }

}

/* =====================================================
   REJECT HELPER
===================================================== */

function reject(reason){

  return {
    valid:false,
    reason
  };

}