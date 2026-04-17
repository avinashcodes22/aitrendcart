import { findSuppliers } from "./supplierFinder.js";

/* ======================================================
   SIMPLE AI SUPPLIER DISCOVERY (SAFE VERSION)
====================================================== */

export async function discoverSuppliersForProduct(productName) {
  try {

    console.log("🔎 Finding supplier for:", productName);

    const suppliers = await findSuppliers(productName);

    if (!suppliers || suppliers.length === 0) {
      console.log("⚠ No suppliers found");
      return null;
    }

    /* ===============================
       PICK BEST SUPPLIER (SIMPLE LOGIC)
    =============================== */

    const best = suppliers[0]; // simplest for now

    const enriched = {
      productName,
      supplier: best.supplier || "Unknown",
      price: best.price || 0,
      rating: best.rating || 4,
      shippingDays: best.shippingDays || 7,

      /* 💰 SIMPLE PRICING MODEL */
      estimatedSellingPrice: (best.price || 0) * 2,

      margin:
        best.price > 0
          ? Math.round(((best.price * 2 - best.price) / (best.price * 2)) * 100)
          : 0
    };

    return {
      suggestion: enriched
    };

  } catch (err) {
    console.error("Supplier discovery error:", err.message);
    return null;
  }
}