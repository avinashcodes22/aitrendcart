import Product from "../models/Product.js";
import Supplier from "../models/Supplier.js";
import AiDecision from "../models/AiDecision.js";

/* ====================================
   SUPPLIER INTELLIGENCE ENGINE
==================================== */

export async function analyzeSuppliers(){

  console.log("🧠 Running Supplier Intelligence...");

  const products = await Product.find().limit(50);

  for(const product of products){

    if(!product.supplier) continue;

    const supplier = await Supplier.findById(product.supplier);

    if(!supplier) continue;

    const cost = supplier.cost || 0;
    const price = product.price || 0;

    const margin =
      price > 0 ? ((price - cost) / price) * 100 : 0;

    /* --------------------------------
       LOW MARGIN DETECTION
    -------------------------------- */

    if(margin < 20){

      await AiDecision.create({

        type:"SUPPLIER_OPTIMIZATION",

        entity:"PRODUCT",

        entityId:product._id,

        suggestion:{
          productName:product.name,
          currentSupplier:supplier.name,
          cost,
          price,
          margin:Math.round(margin)
        },

        reason:`Low margin detected (${Math.round(margin)}%)`

      });

      console.log(
        "⚠ Low margin detected:",
        product.name
      );

    }

  }

  console.log("✅ Supplier analysis finished");

}