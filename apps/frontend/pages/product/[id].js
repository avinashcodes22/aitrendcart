import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import cartApi from "../../lib/cartApi";

/* ===============================
   SSR SAFE VIEWERS
================================ */
const Product3DViewer = dynamic(
  () => import("../../components/Product3DViewer"),
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
  const { slug } = router.query;   // ✅ use slug instead of id
  const { token } = useAuth();
  const { setCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAR, setShowAR] = useState(false);

  /* ===============================
     LOAD PRODUCT BY SLUG
  =============================== */
  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:5000/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p style={{ padding: 20 }}>Loading product...</p>;
  if (!product || product.error)
    return <p style={{ padding: 20 }}>Product not found.</p>;

  /* ===============================
     ADD TO CART
  =============================== */
  async function handleAddToCart() {
    if (!token) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    try {
      const updatedCart = await cartApi.addToCart(token, product._id);
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
    if (!img) {
      alert("No product image available");
      return;
    }

    localStorage.setItem("aitrendcart_tryon_img", img);
    router.push("/tryon");
  }

  /* ===============================
     UI
  =============================== */
  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto", color: "white" }}>

      {/* PRODUCT IMAGE */}
      <img
        src={product.images?.[0] || "/admin/placeholder.svg"}
        alt={product.name}
        style={{ width: "100%", borderRadius: 10, marginBottom: 16 }}
      />

      {/* PRODUCT INFO */}
      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>{product.name}</h1>
      <p style={{ fontSize: 20, margin: "12px 0" }}>₹{product.price}</p>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleAddToCart}
          style={{
            padding: "10px 16px",
            background: "#06b6d4",
            color: "#000",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Add to Cart
        </button>

        <button
          onClick={handleTryOn}
          style={{
            padding: "10px 16px",
            background: "#a855f7",
            color: "#fff",
            borderRadius: 6,
            fontWeight: "bold",
          }}
        >
          Try On
        </button>

        {(product.model3dUrl || product.modelUsdzUrl) && (
          <button
            onClick={() => setShowAR(true)}
            style={{
              padding: "10px 16px",
              background: "#22c55e",
              color: "#000",
              borderRadius: 6,
              fontWeight: "bold",
            }}
          >
            View in AR
          </button>
        )}
      </div>

      {/* ===============================
         3D PREVIEW
      =============================== */}
      {product.model3dUrl && (
        <div style={{ marginTop: 30 }}>
          <h3>3D Preview</h3>
          <Product3DViewer modelUrl={product.model3dUrl} />
        </div>
      )}

      {/* ===============================
         AR TERMS POPUP
      =============================== */}
      {showAR && (
        <ARTerms onAccept={() => setShowAR(false)} />
      )}

      {/* ===============================
         AR VIEWER
      =============================== */}
      {!showAR && (product.model3dUrl || product.modelUsdzUrl) && (
        <div style={{ marginTop: 30 }}>
          <h3>View in 3D / AR</h3>
          <ProductARViewer
            glbUrl={product.model3dUrl}
            usdzUrl={product.modelUsdzUrl}
          />
        </div>
      )}
    </div>
  );
}