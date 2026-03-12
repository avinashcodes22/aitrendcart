import Product from "../models/Product.js";

/*
AI Product Discovery Engine (V1)

Goal:
Identify interesting products based on
engagement, availability and price signals.

IMPORTANT
This service NEVER modifies the database.
It only returns AI suggestions.
*/

function calculateOpportunityScore(product) {
  const priceScore =
    product.price > 0 ? Math.min(product.price / 1000, 10) : 0;

  const stockScore =
    product.stock > 0 ? Math.min(product.stock / 10, 10) : 0;

  const arEngagement =
    product.arViews > 0 ? Math.min(product.arViews / 20, 10) : 0;

  const freshness =
    product.createdAt
      ? Math.max(
          0,
          10 -
            (Date.now() - new Date(product.createdAt)) /
              (1000 * 60 * 60 * 24 * 7)
        )
      : 0;

  const score =
    priceScore * 0.25 +
    stockScore * 0.25 +
    arEngagement * 0.25 +
    freshness * 0.25;

  return Math.round(score * 10);
}

export async function discoverProducts() {
  try {
    const products = await Product.find({
      stock: { $gt: 0 },
    }).limit(500);

    const results = products.map((p) => {
      const opportunityScore =
        calculateOpportunityScore(p);

      return {
        id: p._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        supplier: p.supplier,
        arViews: p.arViews,
        opportunityScore,
      };
    });

    results.sort(
      (a, b) => b.opportunityScore - a.opportunityScore
    );

    return results.slice(0, 50);
  } catch (error) {
    console.error(
      "Discovery AI Error:",
      error
    );
    return [];
  }
}