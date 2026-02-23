import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";


const Admin3DViewer = dynamic(
  () => import("../../components/admin/Admin3DViewer"),
  { ssr: false }
);

export default function AdminProductsPage() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD PRODUCTS
  =============================== */
  async function loadProducts() {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
        setError("");
      } else {
        setError(data.error || "Failed to load products");
      }
    } catch {
      setError("Backend not reachable");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, [token]);

  /* ===============================
     TOGGLE AR PERMISSION
  =============================== */
  async function toggleAR(id, value) {
    if (!token) return;

    try {
      await fetch(`http://localhost:5000/api/products/${id}/ar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isARAllowed: value }),
      });

      loadProducts(); // reload list
    } catch (err) {
      console.error("AR toggle failed:", err);
      alert("Failed to update AR setting");
    }
  }

  /* ===============================
     UI STATES
  =============================== */
  if (loading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-400">{error}</div>;

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6 max-w-4xl mx-auto text-white">
          <h1 className="text-2xl font-bold mb-6 text-cyan-400">
            Admin Products
          </h1>

          {products.length === 0 && (
            <p className="text-white/60">No products found</p>
          )}

          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-black/40 border border-white/10 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-white/60">
                    ₹{p.price}
                  </div>

                  {/* AR STATUS */}
                  <div className="text-xs mt-1">
                    {p.isARAllowed
                      ? "🟢 AR Enabled"
                      : "⚪ AR Disabled"}
                  </div>
                </div>

                <div className="flex gap-2 items-center">

                  {/* AR TOGGLE */}
                  <button
                    onClick={() =>
                      toggleAR(p._id, !p.isARAllowed)
                    }
                    className={`px-3 py-1 rounded text-sm ${
                      p.isARAllowed
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {p.isARAllowed
                      ? "Disable AR"
                      : "Enable AR"}
                  </button>

                  {/* 3D VIEWER */}
                  {p.model3dUrl ? (
                    <button
                      onClick={() => setSelected(p)}
                      className="px-3 py-1 bg-cyan-500 rounded-md text-sm"
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

          {/* ===============================
             3D MODAL
          =============================== */}
          {selected && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-[#050816] border border-white/10 rounded-2xl w-full max-w-3xl p-4">
                <div className="flex justify-between items-center mb-3">
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
                    className="text-white/60"
                  >
                    ✕
                  </button>
                </div>

                <Admin3DViewer
                  modelUrl={selected.model3dUrl}
                />
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}