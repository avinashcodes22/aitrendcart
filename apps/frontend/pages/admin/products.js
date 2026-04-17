import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { productsApi } from "../../lib/api";

const Admin3DViewer = dynamic(
  () => import("../../components/admin/Admin3DViewer"),
  { ssr: false }
);

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AdminProductsPage() {

  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD PRODUCTS
  =============================== */
  async function loadProducts() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const data = await productsApi.getAll();

      /* 🔥 HANDLE MULTIPLE FORMATS */
      const parsed =
        data?.products ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setProducts(parsed);
      setError("");

    } catch (err) {

      console.error(err);
      setError("Backend not reachable");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {
    loadProducts();
  }, [user]);

  /* ===============================
     TOGGLE AR (FIXED)
  =============================== */
  async function toggleAR(id, value) {

    try {

      if (!user) return;

      const token = await user.getIdToken(); // ✅ FIXED

      const res = await fetch(
        `${API}/api/products/${id}/ar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` // ✅ ADDED
          },
          body: JSON.stringify({ isARAllowed: value }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("AR toggle error:", text);
        alert("Failed to update AR setting");
        return;
      }

      loadProducts();

    } catch (err) {

      console.error(err);
      alert("Failed to update AR setting");

    }

  }

  /* ===============================
     UI
  =============================== */

  if (loading)
    return <div className="p-6 text-white">Loading products...</div>;

  if (error)
    return <div className="p-6 text-red-400">{error}</div>;

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="text-white">

          <h1 className="text-2xl font-bold mb-6 text-cyan-400">
            Admin Products
          </h1>

          {products.length === 0 && (
            <p className="text-white/60">No products found</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((p) => (
              <div
                key={p._id}
                className="bg-black/40 border border-cyan-500/20 p-5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-lg">
                    {p.name}
                  </div>

                  <div className="text-cyan-300">
                    ₹{p.price}
                  </div>

                  <div className="text-xs mt-2">
                    {p.isARAllowed
                      ? "🟢 AR Enabled"
                      : "⚪ AR Disabled"}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">

                  <button
                    onClick={() => toggleAR(p._id, !p.isARAllowed)}
                    className={`px-3 py-1 rounded text-sm ${
                      p.isARAllowed
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {p.isARAllowed ? "Disable AR" : "Enable AR"}
                  </button>

                  {p.model3dUrl ? (
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 rounded-md text-sm"
                    >
                      View 3D
                    </button>
                  ) : (
                    <span className="text-xs text-white/40">
                      No 3D Model
                    </span>
                  )}

                </div>
              </div>
            ))}

          </div>

          {/* 3D VIEWER */}
          {selected && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-[#050816] border border-cyan-500/20 rounded-2xl w-full max-w-4xl p-5">

                <div className="flex justify-between mb-3">
                  <div>
                    <div className="font-bold">
                      {selected.name}
                    </div>
                    <div className="text-xs text-white/60">
                      3D Preview
                    </div>
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <Admin3DViewer modelUrl={selected.model3dUrl} />

              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}