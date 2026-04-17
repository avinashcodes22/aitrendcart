import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DiscoveryFeed() {

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadProducts() {

    if (loading) return;

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/discovery"
      );

      const data = await res.json();

      if (data.success) {

        setProducts(prev => [
          ...prev,
          ...data.products
        ]);

      }

    }
    catch(err){

      console.error("Discovery load error:", err);

    }

    setLoading(false);

  }

  useEffect(() => {

    loadProducts();

  }, []);

  /* ============================
     INFINITE SCROLL
  ============================ */

  useEffect(() => {

    function handleScroll() {

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 400
      ) {

        loadProducts();
        setPage(p => p + 1);

      }

    }

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, [loading]);

  return (

    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      {products.map((p, index) => {

        const badges = [];

        if (p.isARAllowed) badges.push("🧑‍🚀 AR");
        if (p.model3dUrl) badges.push("🧊 3D");
        if (p.arViews > 20) badges.push("🔥 Popular");

        return (

          <Link
            key={p._id + index}
            href={`/product/${p.slug || p._id}`}
            className="group"
          >

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md transition"
            >

              <div className="relative overflow-hidden rounded-lg">

                <img
                  src={p.images?.[0] || "/placeholder.png"}
                  className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                />

                {badges.length > 0 && (

                  <div className="absolute top-2 left-2 flex flex-col gap-1">

                    {badges.map((b, i) => (

                      <span
                        key={i}
                        className="text-xs bg-black/70 px-2 py-1 rounded text-cyan-300 border border-cyan-500/20"
                      >
                        {b}
                      </span>

                    ))}

                  </div>

                )}

              </div>

              <div className="mt-3">

                <div className="font-semibold text-white line-clamp-1">
                  {p.name}
                </div>

                <div className="text-cyan-300 mt-1">
                  ₹{p.price}
                </div>

              </div>

            </motion.div>

          </Link>

        );

      })}

      {loading && (
        <div className="text-gray-400 col-span-full text-center">
          Loading more products...
        </div>
      )}

    </div>

  );

}