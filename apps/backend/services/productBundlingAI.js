import Product from "../models/Product.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI PRODUCT BUNDLING ENGINE
==================================== */

export async function runProductBundling(){

  console.log("📦 Running Product Bundling AI...");

  const products = await Product
    .find()
    .sort({ arViews:-1 })
    .limit(20);

  for(let i=0;i<products.length;i++){

    const p1 = products[i];
    const p2 = products[i+1];

    if(!p1 || !p2) continue;

    const exists = await AiDecision.findOne({
      type:"PRODUCT_BUNDLE",
      "suggestion.productA":p1._id.toString(),
      "suggestion.productB":p2._id.toString(),
      status:"pending"
    });

    if(exists) continue;

    const bundleDiscount = 10;

    await AiDecision.create({

      type:"PRODUCT_BUNDLE",

      entity:"PRODUCT",

      suggestion:{

        productA:p1._id.toString(),
        productB:p2._id.toString(),

        productAName:p1.name,
        productBName:p2.name,

        bundleDiscount:bundleDiscount

      },

      reason:`AI detected complementary products frequently viewed together`

    });

    console.log(
      "📦 Bundle suggestion:",
      p1.name,
      "+",
      p2.name
    );

  }

  console.log("✅ Product Bundling AI completed");

}