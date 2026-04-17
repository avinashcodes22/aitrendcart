import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TrendingProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/recommend")
      .then(res => res.json())
      .then(data => {

        if (Array.isArray(data)) {
          setProducts(data.slice(0, 8));
        } else if (data?.products) {
          setProducts(data.products.slice(0, 8));
        }

      })
      .catch(err => {
        console.error("Trending products error:", err);
      });

  }, []);

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-orange-400">
        🔥 AI Trending Picks
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {products.map((p, index) => (

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
              className="bg-black/40 border border-orange-500/20 rounded-xl p-4 backdrop-blur-md"
            >

              <div className="overflow-hidden rounded-lg">

                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  alt={p.name}
                  className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                />

              </div>

              <div className="mt-3 font-semibold text-white line-clamp-1">
                {p.name}
              </div>

              <div className="text-orange-300 mt-1">
                ₹{p.price}
              </div>

            </motion.div>

          </Link>

        ))}

      </div>

    </section>
  );
}