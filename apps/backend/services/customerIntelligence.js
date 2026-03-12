import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   CUSTOMER INTELLIGENCE ENGINE
==================================== */

export async function runCustomerIntelligence(){

  console.log("🧠 Running Customer Intelligence...");

  const orders = await Order.find().sort({createdAt:-1});

  const customerStats = {};

  for(const order of orders){

    const user = order.userId?.toString();

    if(!user) continue;

    if(!customerStats[user]){

      customerStats[user] = {
        orders:0,
        revenue:0
      };

    }

    customerStats[user].orders += 1;
    customerStats[user].revenue += order.amount || 0;

  }

  for(const [userId,data] of Object.entries(customerStats)){

    /* --------------------------------
       VIP CUSTOMER DETECTION
    -------------------------------- */

    if(data.revenue > 10000){

      await AiDecision.create({

        type:"VIP_CUSTOMER",

        entity:"USER",

        entityId:userId,

        suggestion:{

          user:userId,
          totalRevenue:data.revenue,
          orders:data.orders,

          rewardSuggestion:{
            type:"discount",
            value:15
          }

        },

        reason:`High value customer detected (₹${data.revenue} spent)`

      });

      console.log("⭐ VIP customer detected:",userId);

    }

    /* --------------------------------
       FREQUENT BUYER
    -------------------------------- */

    if(data.orders >= 5){

      await AiDecision.create({

        type:"LOYAL_CUSTOMER",

        entity:"USER",

        entityId:userId,

        suggestion:{

          user:userId,
          orders:data.orders,

          rewardSuggestion:{
            type:"loyalty_points",
            value:500
          }

        },

        reason:`Frequent buyer (${data.orders} orders)`

      });

    }

  }

  console.log("✅ Customer intelligence finished");

}