import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "../lib/api";
import RecommendedProducts from "../components/RecommendedProducts";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.products().then(setProducts);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">AItrendcart</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p._id}
            href={`/product/${p._id}`}
            className="border border-white/10 rounded-lg p-3 hover:opacity-80"
          >
            <img
              src={p.images?.[0] || "/admin/placeholder.svg"}
              className="rounded mb-2"
            />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm opacity-70">₹{p.price}</div>
            <RecommendedProducts />

          </Link>
        ))}
      </div>
    </div>
  );
}
