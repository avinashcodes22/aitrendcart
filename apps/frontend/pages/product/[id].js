import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import cartApi from "../../lib/cartApi";

import ProductAssistant from "../../components/ai/ProductAssistant";
import RecommendedProducts from "../../components/recommendations/RecommendedProducts";
import ProductFeatures from "../../components/product/ProductFeatures";

/* ===============================
   SSR SAFE VIEWERS
================================ */

const Product3DViewer = dynamic(
  () => import("../../components/ar/Product3DViewer"),
  { ssr: false }
);

const ProductARViewer = dynamic(
  () => import("../../components/ar/ProductARViewer"),
  { ssr: false }
);

const ARTerms = dynamic(
  () => import("../../components/ar/ARTerms"),
  { ssr: false }
);

export default function ProductPage() {

  const router = useRouter();
  const { id } = router.query;

  const { token } = useAuth();
  const { setCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAR, setShowAR] = useState(false);

  const [recommended, setRecommended] = useState([]);

  /* ===============================
     LOAD PRODUCT
  =============================== */

  useEffect(() => {

    if (!id) return;

    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {

        if (data?.error) setProduct(null);
        else setProduct(data);

        setLoading(false);

      })
      .catch(err => {

        console.error(err);
        setLoading(false);

      });

  }, [id]);

  /* ===============================
     LOAD RECOMMENDATIONS
  =============================== */

  useEffect(() => {

    if (!id) return;

    fetch(`http://localhost:5000/api/recommend?productId=${id}`)
      .then(res => res.json())
      .then(data => {

        if (data?.products) {
          setRecommended(data.products);
        }

      })
      .catch(err => console.error(err));

  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Product not found.
      </div>
    );
  }

  /* ===============================
     ADD TO CART
  =============================== */

  async function handleAddToCart() {

    if (!token) {
      router.push("/login");
      return;
    }

    try {

      const updatedCart =
        await cartApi.addToCart(token, product._id);

      setCart(updatedCart);

      alert("Added to cart");

    } catch (err) {

      console.error(err);
      alert("Failed to add to cart");

    }

  }

  /* ===============================
     TRY ON
  =============================== */

  function handleTryOn() {

    const img = product.images?.[0];
    if (!img) return;

    localStorage.setItem(
      "aitrendcart_tryon_img",
      img
    );

    router.push("/tryon");

  }

  const hotspots = [
    {
      position: [0.4, 0.2, 0.3],
      label: "Premium Material",
      description: "High-quality durable material."
    },
    {
      position: [-0.3, 0.1, 0.2],
      label: "Comfort Design",
      description: "Designed for long-term comfort."
    }
  ];

  return (
    <div className="bg-black text-white">

      {/* HERO PRODUCT */}

      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <img
            src={product.images?.[0] || "/admin/placeholder.svg"}
            alt={product.name}
            className="w-full rounded-xl"
          />

        </motion.div>

        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {product.name}
          </h1>

          <p className="text-3xl text-cyan-400 mb-8">
            ₹{product.price}
          </p>

          <div className="flex flex-wrap gap-4">

            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleTryOn}
              className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-500 transition"
            >
              Try On
            </button>

            {(product.model3dUrl || product.modelUsdzUrl) && (

              <button
                onClick={() => setShowAR(true)}
                className="px-6 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition"
              >
                View in AR
              </button>

            )}

          </div>

        </motion.div>

      </section>

      {/* PRODUCT STORY */}

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">

        <h2 className="text-4xl font-bold mb-6">
          Experience {product.name}
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Designed with precision and crafted for everyday performance.
          Explore every detail through immersive 3D and augmented reality.
        </p>

      </section>

      {/* FEATURE HIGHLIGHTS */}

      <ProductFeatures product={product} />

      {/* 3D EXPERIENCE */}

      {product.model3dUrl && (

        <section className="max-w-6xl mx-auto px-6 py-20">

          <h2 className="text-3xl font-bold mb-4 text-cyan-300">
            Explore Every Detail in 3D
          </h2>

          <p className="text-gray-400 mb-6">
            Rotate and inspect the product from every angle before purchasing.
          </p>

          <Product3DViewer
            modelUrl={product.model3dUrl}
            hotspots={hotspots}
          />

        </section>

      )}

      {/* AR EXPERIENCE */}

      {!showAR &&
        (product.model3dUrl || product.modelUsdzUrl) && (

        <section className="max-w-6xl mx-auto px-6 pb-20">

          <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
            See It In Your Space
          </h2>

          <p className="text-gray-400 mb-6">
            Use augmented reality to preview the product directly in your environment.
          </p>

          <ProductARViewer
            glbUrl={product.model3dUrl}
            usdzUrl={product.modelUsdzUrl}
          />

        </section>

      )}

      {showAR && (
        <ARTerms onAccept={() => setShowAR(false)} />
      )}

      {/* AI PRODUCT ASSISTANT */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <ProductAssistant product={product} />

      </section>

      {/* RELATED PRODUCTS */}

      {recommended.length > 0 && (

        <section className="max-w-7xl mx-auto px-6 pb-24">

          <h2 className="text-2xl font-semibold mb-6 text-cyan-300">
            You may also like
          </h2>

          <RecommendedProducts products={recommended} />

        </section>

      )}

    </div>
  );
}