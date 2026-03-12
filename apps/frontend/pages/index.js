import { useEffect, useState } from "react";
import Link from "next/link";
import { productsApi } from "../lib/api";
import RecommendedProducts from "../components/recommendations/RecommendedProducts";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi.getAll()
      .then(setProducts)
      .catch((err) => console.error("Load products error:", err));
  }, []);

  return (
    <div className="p-6 text-white">

      <h1 className="text-3xl font-bold mb-6 text-cyan-400">
        AItrendcart Products
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p.slug}`}
            className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 hover:scale-105 transition"
          >
            <img
              src={p.images?.[0] || "/placeholder.png"}
              className="w-full h-40 object-cover rounded"
            />

            <div className="mt-3 font-semibold">{p.name}</div>
            <div className="text-cyan-300">₹{p.price}</div>
          </Link>
        ))}
      </div>

      {/* AI Recommendations */}
      <RecommendedProducts products={products.slice(0, 4)} />

    </div>
  );
}