export async function fetchProducts(credentials) {
  throw new Error("fetchProducts() must be implemented by adapter");
}

export function normalizeProduct(raw, supplier) {
  return {
    supplier,
    productId: raw.id || raw.productId || "unknown",
    name: raw.title || raw.name,
    price: raw.price || 0,
    images: raw.images || [],
    stock: raw.stock || 0,
    category: raw.category || "Misc",
    sourceUrl: raw.url || "",
    createdAt: new Date(),
  };
}
