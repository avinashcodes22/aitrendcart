import Product from "../models/Product.js";

export const fetchProducts = async ({ supplier, limit = 50 }) => {
  const query = {};
  if (supplier) query.supplier = supplier;

  return Product.find(query)
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();
};

export const fetchProductBySlug = async (slug) => {
  return Product.findOne({ slug }).lean();
};

export const createProduct = async (data) => {
  return Product.create(data);
};

export const updateProductBySlug = async (slug, data) => {
  return Product.findOneAndUpdate({ slug }, data, { new: true });
};

export const deleteProductBySlug = async (slug) => {
  return Product.findOneAndDelete({ slug });
};

export const toggleARPermission = async (slug, isARAllowed) => {
  return Product.findOneAndUpdate(
    { slug },
    { isARAllowed },
    { new: true }
  );
};