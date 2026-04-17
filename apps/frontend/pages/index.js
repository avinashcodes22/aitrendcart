import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import RecommendedProducts from "../components/recommendations/RecommendedProducts";
import ImmersiveHero from "../components/hero/ImmersiveHero";
import TrendingProducts from "../components/trending/TrendingProducts";

const API = "http://localhost:5000";

function resolveImage(p) {
  if (!p?.images?.length) return "/placeholder.png";

  const img = p.images[0];

  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return `${API}${img}`;

  return `${API}/${img}`;
}

export default function HomePage() {

  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const loadMoreRef = useRef();

  const PAGE_SIZE = 8;

  /* ===============================
     LOAD PRODUCTS
  =============================== */

  useEffect(() => {

    async function loadFeed() {

      try {

        let res = await fetch("http://localhost:5000/api/discovery");

        let data;

        try {
          data = await res.json();
        } catch {
          data = null;
        }

        let list = [];

        if (data?.success && data.products?.length) {

          list = data.products;

        } else {

          const fallback = await fetch(
            "http://localhost:5000/api/products"
          );

          const fallbackData = await fallback.json();

          if (Array.isArray(fallbackData)) {
            list = fallbackData;
          } else if (fallbackData?.products) {
            list = fallbackData.products;
          }

        }

        setProducts(list);
        setVisible(list.slice(0, PAGE_SIZE));

      }
      catch (err) {

        console.error("Product load error:", err);

      }
      finally {

        setLoading(false);

      }

    }

    loadFeed();

  }, []);

  /* ===============================
     INFINITE SCROLL
  =============================== */

  useEffect(() => {

    const observer = new IntersectionObserver(entries => {

      if (!entries[0].isIntersecting) return;

      setVisible(prev => {

        if (prev.length >= products.length) return prev;

        return products.slice(
          0,
          prev.length + PAGE_SIZE
        );

      });

    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();

  }, [products]);

  /* ===============================
     SEARCH + FILTER
  =============================== */

  useEffect(() => {

    let list = [...products];

    if (query) {

      const q = query.toLowerCase();

      list = list.filter(p =>
        p.name?.toLowerCase().includes(q)
      );

    }

    if (filter === "ar") {
      list = list.filter(p => p.isARAllowed);
    }

    if (filter === "3d") {
      list = list.filter(p => p.model3dUrl);
    }

    if (filter === "low") {
      list = list.filter(p => p.price < 1000);
    }

    if (filter === "high") {
      list = list.filter(p => p.price > 2000);
    }

    setVisible(list.slice(0, PAGE_SIZE));

  }, [query, filter, products]);

  return (

    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white"
    >

      <ImmersiveHero />

      <TrendingProducts />

      <section className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-cyan-400">
          Discover Products
        </h1>

        {/* SEARCH */}

        <div className="flex flex-wrap gap-4 mb-6">

          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-2 rounded-lg bg-black border border-white/10 text-white w-64 focus:border-cyan-400 outline-none"
          />

          <Link
            href="/visual-search"
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
          >
            📷 Visual Search
          </Link>

        </div>

        {/* FILTERS */}

        <div className="flex gap-3 mb-10 flex-wrap">

          {[
            { id: "all", label: "All" },
            { id: "ar", label: "AR Ready" },
            { id: "3d", label: "3D Ready" },
            { id: "low", label: "Low Price" },
            { id: "high", label: "Premium" }
          ].map(btn => (

            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-4 py-2 rounded-lg border transition ${
                filter === btn.id
                  ? "bg-cyan-500 text-black border-cyan-500"
                  : "border-white/10 hover:border-cyan-400"
              }`}
            >
              {btn.label}
            </button>

          ))}

        </div>

        {/* GRID */}

        {loading && (
          <div className="text-gray-400">
            Loading products...
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="text-gray-400">
            No products found.
          </div>
        )}

        {!loading && visible.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {visible.map((p, index) => (

              <Link
                key={p._id}
                href={`/product/${p.slug || p._id}`}
                className="group"
              >

                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md"
                >

                  <img
                    src={resolveImage(p)}
                    alt={p.name}
                    className="w-full h-40 object-cover rounded"
                  />

                  <div className="mt-3 font-semibold text-white">
                    {p.name}
                  </div>

                  <div className="text-cyan-300">
                    ₹{p.price}
                  </div>

                </motion.div>

              </Link>

            ))}

          </div>

        )}

        <div
          ref={loadMoreRef}
          className="h-20 flex items-center justify-center text-gray-500"
        >
          Loading more...
        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
          AI Recommended For You
        </h2>

        <RecommendedProducts
          products={products.slice(0, 4)}
        />

      </section>

    </motion.div>

  );

}