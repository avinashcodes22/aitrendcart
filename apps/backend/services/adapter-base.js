import Product from "../models/Product.js";

// ✅ Normalize raw supplier product
export function normalizeProduct(raw, supplierKey) {
  return {
    supplier: supplierKey,
    productId: raw.id || raw.productId || "unknown",
    name: raw.title || raw.name || "Untitled product",
    price: Number(raw.price || 0),
    images: raw.images
      ? Array.isArray(raw.images)
        ? raw.images
        : [raw.images]
      : [],
    stock: Number(raw.stock || 0),
    category: raw.category || "Misc",
    sourceUrl: raw.url || "",
  };
}

// ✅ Save or update products in MongoDB
export async function upsertProducts(products) {
  if (!products.length) return { matched: 0, upserted: 0 };

  const ops = products.map((p) => ({
    updateOne: {
      filter: { supplier: p.supplier, productId: p.productId },
      update: { $set: p },
      upsert: true,
    },
  }));

  const result = await Product.bulkWrite(ops);

  return {
    matched: result.matchedCount || 0,
    upserted: result.upsertedCount || 0,
  };
}
