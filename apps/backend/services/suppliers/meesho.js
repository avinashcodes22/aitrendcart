// services/suppliers/meesho.js
// Mock Meesho supplier adapter for local testing

import { normalizeProduct } from "../supplierAdapterBase.js";

const mockProducts = [
  {
    id: "meesho-1",
    title: "3D Glow Saree",
    price: 1299,
    images: ["/admin/placeholder.svg"],
    stock: 12,
    category: "Sarees",
    url: "https://www.meesho.com/product/3d-glow-saree",
  },
  {
    id: "meesho-2",
    title: "Holographic Backpack",
    price: 899,
    images: ["/admin/placeholder.svg"],
    stock: 25,
    category: "Bags",
    url: "https://www.meesho.com/product/holographic-backpack",
  },
  {
    id: "meesho-3",
    title: "Neon Streetwear Jacket",
    price: 1999,
    images: ["/admin/placeholder.svg"],
    stock: 8,
    category: "Jackets",
    url: "https://www.meesho.com/product/neon-streetwear-jacket",
  },
];

export async function fetchProducts({ limit = 10 } = {}) {
  const slice = mockProducts.slice(0, limit);
  return slice.map((p) => normalizeProduct(p, "meesho"));
}
