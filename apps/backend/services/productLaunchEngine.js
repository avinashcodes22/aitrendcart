import AiDecision from "../models/AiDecision.js";
import SupplierProduct from "../models/SupplierProduct.js";

/* =====================================
   AI PRODUCT LAUNCH ENGINE
===================================== */

export async function runProductLaunchEngine() {

  try {

    console.log("🚀 Running AI Product Launch Engine");

    const supplierProducts =
      await SupplierProduct.find().limit(100);

    for (const item of supplierProducts) {

      const score = calculateLaunchScore(item);

      if (score < 7) continue;

      const exists = await AiDecision.findOne({

        type: "PRODUCT_LAUNCH",
        "suggestion.productName": item.productName,
        status: "pending"

      });

      if (exists) continue;

      const suggestedPrice =
        Math.round(item.price * 2.5);

      await AiDecision.create({

        type: "PRODUCT_LAUNCH",

        entity: "PRODUCT",

        suggestion: {

          productName: item.productName,

          supplier: item.supplier,

          supplierSource: item.source,

          cost: item.price,

          suggestedPrice,

          shippingDays: item.shippingDays,

          rating: item.rating

        },

        reason:
          "AI discovered profitable supplier opportunity"

      });

      console.log(
        "🚀 Product launch opportunity:",
        item.productName
      );

    }

    console.log("✅ Product Launch Engine finished");

  }
  catch (err) {

    console.error(
      "Product launch engine error:",
      err.message
    );

  }

}

/* =====================================
   LAUNCH SCORE
===================================== */

function calculateLaunchScore(item) {

  const priceScore =
    item.price ? Math.max(0, 10 - item.price) : 0;

  const ratingScore =
    item.rating ? Number(item.rating) * 2 : 0;

  const shippingScore =
    item.shippingDays
      ? Math.max(0, 10 - item.shippingDays)
      : 0;

  const score =
    priceScore * 0.4 +
    ratingScore * 0.3 +
    shippingScore * 0.3;

  return score;

}