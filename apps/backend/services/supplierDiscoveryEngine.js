import AiDecision from "../models/AiDecision.js";
import { findSuppliers } from "./supplierFinder.js";

/* =====================================================
   AI SUPPLIER DISCOVERY ENGINE
===================================================== */

export async function discoverSuppliersForProduct(productName){

  try{

    console.log("🔎 AI Supplier Discovery:",productName);

    const suppliers = await findSuppliers(productName);

    if(!suppliers.length){
      console.log("⚠ No suppliers found");
      return [];
    }

    const ranked = rankSuppliers(suppliers);

    const bestSupplier = ranked[0];

    const exists = await AiDecision.findOne({
      type:"SUPPLIER_IMPORT",
      "suggestion.productName":productName,
      status:"pending"
    });

    if(exists){
      return [];
    }

    const decision = await AiDecision.create({

      type:"SUPPLIER_IMPORT",

      entity:"SUPPLIER",

      suggestion:{
        productName,
        supplier:bestSupplier.supplier,
        source:bestSupplier.source,
        price:bestSupplier.price,
        moq:bestSupplier.moq,
        rating:bestSupplier.rating,
        shippingDays:bestSupplier.shippingDays
      },

      reason:"AI discovered supplier for trending product"

    });

    console.log("📦 Supplier proposal created:",bestSupplier.supplier);

    return decision;

  }
  catch(err){

    console.error("Supplier discovery error:",err.message);
    return null;

  }

}

/* =====================================================
   SUPPLIER RANKING
===================================================== */

function rankSuppliers(suppliers){

  return suppliers
    .map(s=>({

      ...s.toObject(),

      score:calculateSupplierScore(s)

    }))
    .sort((a,b)=>b.score-a.score);

}

/* =====================================================
   SUPPLIER SCORE
===================================================== */

function calculateSupplierScore(s){

  const priceScore =
    s.price ? Math.max(0,10 - s.price) : 0;

  const ratingScore =
    s.rating ? Number(s.rating) * 2 : 0;

  const shippingScore =
    s.shippingDays ? Math.max(0,10 - s.shippingDays) : 0;

  return (
    priceScore * 0.4 +
    ratingScore * 0.4 +
    shippingScore * 0.2
  );

}