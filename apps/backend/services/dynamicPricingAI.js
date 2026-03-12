import Product from "../models/Product.js";

/* ======================================================
   DYNAMIC PRICING AI ENGINE
====================================================== */

export async function dynamicPricing() {
  try {
    const products = await Product.find().lean();

    const suggestions = [];
    const seen = new Set();

    for (const p of products) {
      if (!p.slug) continue;

      /* ===============================
         REMOVE DUPLICATES
      =============================== */

      if (seen.has(p.slug)) continue;
      seen.add(p.slug);

      const price = p.price ?? 0;
      const views = p.arViews ?? 0;

      let suggestedPrice = price;

      /* ===============================
         PRICING LOGIC
      =============================== */

      if (views > 50) {
        suggestedPrice = Math.round(price * 1.1);
      }

      if (views < 10) {
        suggestedPrice = Math.round(price * 0.9);
      }

      /* ===============================
         ONLY IF CHANGE NEEDED
      =============================== */

      if (suggestedPrice !== price) {
        suggestions.push({
          productId: p._id,
          productName: p.name,
          oldPrice: price,
          suggestedPrice,
        });
      }
    }

    /* ===============================
       LIMIT RESULTS
    =============================== */

    return suggestions.slice(0, 5);

  } catch (err) {
    console.error("Dynamic Pricing AI error:", err);
    return [];
  }
}