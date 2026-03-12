import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   FRAUD DETECTION ENGINE
==================================== */

export async function runFraudDetection(){

  console.log("🛡 Running Fraud Detection...");

  const orders = await Order.find().sort({createdAt:-1}).limit(100);

  const userOrderCount = {};

  for(const order of orders){

    const user = order.userId?.toString();

    if(!user) continue;

    userOrderCount[user] =
      (userOrderCount[user] || 0) + 1;

  }

  for(const [userId,count] of Object.entries(userOrderCount)){

    /* -------------------------------
       SUSPICIOUS ORDER VOLUME
    ------------------------------- */

    if(count >= 5){

      await AiDecision.create({

        type:"FRAUD_ALERT",

        entity:"USER",

        entityId:userId,

        suggestion:{

          user:userId,
          orderCount:count

        },

        reason:`Suspicious activity detected (${count} orders recently)`

      });

      console.log("⚠ Suspicious user:",userId);

    }

  }

  console.log("✅ Fraud detection finished");

}