import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function RecommendedProducts({ products = [] }) {

  const items = Array.isArray(products) ? products : [];
  const [preview, setPreview] = useState(null);

  if (!items.length) {
    return (
      <div className="text-gray-400">
        No recommendations available
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {items.map((p, index) => {

          const badges = [];

          if (p.isARAllowed) badges.push("🧑‍🚀 AR Ready");
          if (p.model3dUrl) badges.push("🧊 3D Preview");
          if (p.arViews > 20) badges.push("🔥 Popular");

          return (

            <div
              key={p._id}
              className="group relative"
            >

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md transition"
              >

                {/* IMAGE */}

                <div className="overflow-hidden rounded-lg relative">

                  <img
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
                    className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* BADGES */}

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

                {/* PRODUCT INFO */}

                <div className="mt-3">

                  <div className="font-semibold text-white line-clamp-1">
                    {p.name}
                  </div>

                  <div className="text-cyan-300 mt-1">
                    ₹{p.price}
                  </div>

                </div>

                {/* QUICK VIEW BUTTON */}

                <button
                  onClick={() => setPreview(p)}
                  className="mt-3 w-full text-sm py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition"
                >
                  Quick View
                </button>

              </motion.div>

            </div>

          );
        })}

      </div>

      {/* QUICK VIEW MODAL */}

      {preview && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full">

            <img
              src={preview.images?.[0] || "/placeholder.png"}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />

            <h3 className="text-xl font-semibold">
              {preview.name}
            </h3>

            <p className="text-cyan-300 mb-4">
              ₹{preview.price}
            </p>

            <div className="flex gap-3">

              <Link
                href={`/product/${preview.slug || preview._id}`}
                className="flex-1 text-center py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
              >
                View Product
              </Link>

              <button
                onClick={() => setPreview(null)}
                className="px-4 py-2 border border-white/20 rounded-lg"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}