import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const API_URL = "http://localhost:5000";

export default function ProductCard({ product }) {

  const [hover, setHover] = useState(false);
  const [preview, setPreview] = useState(false);

  /* ===============================
     FIX IMAGE URL
  =============================== */

  let image = "/placeholder.png";

  if (product?.images?.length > 0) {

    const img = product.images[0];

    if (img.startsWith("http")) {
      image = img;
    } else {
      image = `${API_URL}/${img}`;
    }

  }

  /* ===============================
     BADGES
  =============================== */

  const badges = [];

  if (product.model3dUrl) badges.push("🧊 3D");
  if (product.isARAllowed) badges.push("🧑‍🚀 AR");

  if (product.arViews > 30) badges.push("🔥 Trending");
  else if (product.arViews > 10) badges.push("⭐ Popular");

  return (
    <>
      <motion.div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(34,211,238,0.25)"
        }}
        className="relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer transition-all"
      >

        {/* IMAGE */}

        <div className="relative overflow-hidden">

          <Link href={`/product/${product.slug || product._id}`}>

            <img
              src={image}
              alt={product.name}
              className="w-full h-64 object-cover transition duration-500"
            />

          </Link>

          {/* HOVER OVERLAY */}

          <div
            className={`absolute inset-0 flex items-center justify-center transition ${
              hover ? "bg-black/40" : "bg-transparent"
            }`}
          >

            {hover && (

              <div className="flex gap-2">

                <Link
                  href={`/product/${product.slug || product._id}`}
                  className="text-xs px-3 py-1 bg-cyan-500 text-black rounded-full"
                >
                  Explore
                </Link>

                <button
                  onClick={(e)=>{
                    e.stopPropagation();
                    setPreview(true);
                  }}
                  className="text-xs px-3 py-1 bg-white text-black rounded-full"
                >
                  Quick View
                </button>

              </div>

            )}

          </div>

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

        <div className="p-4">

          <h3 className="text-white text-sm font-medium line-clamp-1">
            {product.name}
          </h3>

          <p className="text-cyan-300 text-sm mt-2">
            ₹{product.price}
          </p>

        </div>

      </motion.div>

      {/* QUICK VIEW MODAL */}

      {preview && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="bg-zinc-900 p-6 rounded-xl max-w-md w-full">

            <img
              src={image}
              className="w-full h-56 object-cover rounded-lg mb-4"
            />

            <h3 className="text-xl font-semibold">
              {product.name}
            </h3>

            <p className="text-cyan-300 mb-4">
              ₹{product.price}
            </p>

            <div className="flex gap-3">

              <Link
                href={`/product/${product.slug || product._id}`}
                className="flex-1 text-center py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
              >
                View Product
              </Link>

              <button
                onClick={()=>setPreview(false)}
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