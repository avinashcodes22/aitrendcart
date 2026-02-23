const restrictedCategories = ["Swimwear", "Lingerie", "Undergarments", "Adult"];

export function normalizeProduct(raw, supplierKey) {
  const category = raw.category || "Misc";

  const product = {
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
    category,
    sourceUrl: raw.url || "",
  };

  product.isRestricted = restrictedCategories.some((c) =>
    category.toLowerCase().includes(c.toLowerCase())
  );

  return product;
}
