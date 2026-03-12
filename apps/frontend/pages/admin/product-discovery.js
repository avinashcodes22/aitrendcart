import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function ProductDiscovery() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD DISCOVERY DATA
  =============================== */

  async function loadDiscovery() {
    try {
      const res = await fetch(`${API}/api/admin/discovery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Discovery API error:", text);
        setLoading(false);
        return;
      }

      const data = await res.json();

      /* ===============================
         FIX: READ PRODUCTS CORRECTLY
      =============================== */

      if (data.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error("Discovery error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (token) loadDiscovery();
  }, [token]);

  /* ===============================
     IMPORT PRODUCT
  =============================== */

  async function importProduct(product) {
    try {
      const res = await fetch(
        `${API}/api/admin/discovery/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Product imported successfully");
        loadDiscovery();
      }

    } catch (err) {
      console.error("Import error:", err);
    }
  }

  /* ===============================
     OPPORTUNITY COLOR
  =============================== */

  function scoreColor(score) {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  }

  /* ===============================
     TREND BADGES
  =============================== */

  function badge(product) {

    if (product.arViews > 30)
      return (
        <span className="ml-2 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
          🔥 Trending
        </span>
      );

    if (product.opportunityScore >= 8)
      return (
        <span className="ml-2 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
          📈 Rising
        </span>
      );

    if (product.opportunityScore >= 5)
      return (
        <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded">
          🟠 Watch
        </span>
      );

    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          AI Product Discovery
        </h1>

        {loading && (
          <p className="text-white/60">
            Loading AI suggestions...
          </p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-white/60">
            No products discovered
          </p>
        )}

        {!loading && products.length > 0 && (
          <div className="overflow-x-auto border border-cyan-500/20 rounded-xl">

            <table className="min-w-full text-sm">

              <thead className="bg-cyan-500/10 text-cyan-300">

                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Supplier</th>
                  <th className="p-3 text-left">Trend</th>
                  <th className="p-3 text-left">Demand</th>
                  <th className="p-3 text-left">Margin</th>
                  <th className="p-3 text-left">Opportunity</th>
                  <th className="p-3 text-left">Action</th>
                </tr>

              </thead>

              <tbody>

                {products.map((p) => (
                  <tr
                    key={p.id || p._id}
                    className="border-t border-cyan-500/10 hover:bg-cyan-500/5"
                  >

                    <td className="p-3 text-white flex items-center">
                      {p.name}
                      {badge(p)}
                    </td>

                    <td className="p-3 text-white">
                      ₹{p.price}
                    </td>

                    <td className="p-3 text-white">
                      {p.stock}
                    </td>

                    <td className="p-3 text-white">
                      {p.supplier}
                    </td>

                    <td className="p-3 text-white">
                      {p.trendScore}
                    </td>

                    <td className="p-3 text-white">
                      {p.demandScore}
                    </td>

                    <td className="p-3 text-white">
                      {p.marginScore}
                    </td>

                    <td
                      className={`p-3 font-bold ${scoreColor(
                        p.opportunityScore
                      )}`}
                    >
                      {p.opportunityScore}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() => importProduct(p)}
                        className="bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded text-xs"
                      >
                        Import
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </AdminLayout>
  );
}