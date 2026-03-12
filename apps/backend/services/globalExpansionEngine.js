import AiDecision from "../models/AiDecision.js";
import Order from "../models/Order.js";

/* ====================================
   GLOBAL EXPANSION ENGINE
==================================== */

const markets = [
  { country: "UAE", demandScore: 80, shippingEase: 70 },
  { country: "Singapore", demandScore: 75, shippingEase: 85 },
  { country: "Germany", demandScore: 90, shippingEase: 60 },
  { country: "Australia", demandScore: 70, shippingEase: 80 }
];

export async function runGlobalExpansion() {

  console.log("🌍 Running Global Expansion AI...");

  const orders = await Order.countDocuments();

  for (const market of markets) {

    const score =
      market.demandScore * 0.6 +
      market.shippingEase * 0.4;

    if (score < 70) continue;

    const exists = await AiDecision.findOne({
      type: "GLOBAL_EXPANSION",
      "suggestion.country": market.country,
      status: "pending"
    });

    if (exists) continue;

    await AiDecision.create({

      type: "GLOBAL_EXPANSION",

      entity: "MARKET",

      suggestion: {
        country: market.country,
        expectedDemand: market.demandScore,
        shippingEase: market.shippingEase,
        score
      },

      reason: `AI detected strong expansion opportunity in ${market.country}`

    });

    console.log("🌎 Expansion suggestion:", market.country);

  }

  console.log("✅ Global Expansion analysis complete");

}