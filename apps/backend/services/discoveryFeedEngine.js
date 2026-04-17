import Product from "../models/Product.js";

/* =====================================================
   AI DISCOVERY FEED ENGINE
   Ranks products for storefront discovery
===================================================== */

function calculateDiscoveryScore(product) {

  let score = 0;

  /* -------------------------------------
     AR ENGAGEMENT SIGNAL
  ------------------------------------- */

  if (product.arViews) {
    score += Math.min(product.arViews / 50, 5);
  }

  /* -------------------------------------
     FRESHNESS SIGNAL
  ------------------------------------- */

  if (product.createdAt) {

    const days =
      (Date.now() - new Date(product.createdAt)) /
      (1000 * 60 * 60 * 24);

    score += Math.max(0, 5 - days / 3);

  }

  /* -------------------------------------
     STOCK SIGNAL
  ------------------------------------- */

  if (product.stock > 0) {
    score += Math.min(product.stock / 20, 3);
  }

  /* -------------------------------------
     PRICE SIGNAL
  ------------------------------------- */

  if (product.price) {
    score += Math.min(product.price / 2000, 2);
  }

  return score;

}

/* =====================================================
   DISCOVERY FEED
===================================================== */

export async function generateDiscoveryFeed(limit = 20) {

  try {

    const products = await Product.find({
      stock: { $gt: 0 }
    })
    .limit(500)
    .lean();

    const scored = products.map(p => {

      const score = calculateDiscoveryScore(p);

      return {
        product: p,
        score
      };

    });

    scored.sort((a, b) => b.score - a.score);

    return scored
      .slice(0, limit)
      .map(s => s.product);

  }
  catch(err){

    console.error(
      "Discovery Feed Engine Error:",
      err
    );

    return [];

  }

}