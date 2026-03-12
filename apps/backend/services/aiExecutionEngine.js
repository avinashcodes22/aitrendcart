import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI EXECUTION ENGINE
==================================== */

export async function executeDecision(decisionId){

  const decision = await AiDecision.findById(decisionId);

  if(!decision) throw new Error("Decision not found");

  if(decision.status !== "approved"){
    throw new Error("Decision not approved");
  }

  console.log("⚙️ Executing decision:",decision.type);

  switch(decision.type){

    /* ====================================
       PRICE UPDATE
    ==================================== */

    case "PRICE_UPDATE":

      await Product.findByIdAndUpdate(
        decision.entityId,
        {
          price:decision.suggestion.newPrice
        }
      );

      break;

    /* ====================================
       RESTOCK PRODUCT
    ==================================== */

    case "STORE_RESTOCK":

      await Product.findByIdAndUpdate(
        decision.entityId,
        {
          $inc:{
            stock:decision.suggestion.suggestedQuantity
          }
        }
      );

      break;

    /* ====================================
       PROMOTION
    ==================================== */

    case "STORE_PROMOTION":

      await Product.findByIdAndUpdate(
        decision.entityId,
        {
          discount:decision.suggestion.discount
        }
      );

      break;

    /* ====================================
       DEFAULT
    ==================================== */

    default:

      console.log("No execution rule for:",decision.type);

  }

  decision.executed = true;
  decision.executedAt = new Date();

  await decision.save();

  console.log("✅ Decision executed");

}