import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function SuppliersAdmin() {

  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD SUPPLIER PRODUCTS
  =============================== */

  async function loadSupplierProducts(token) {

    try {

      const res = await fetch(
        `${API}/api/admin/supplier-products`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setProducts(data.products || []);

    } catch (err) {
      console.error("Supplier products error:", err);
    }

  }

  /* ===============================
     LOAD AI DECISIONS
  =============================== */

  async function loadDecisions(token) {

    try {

      const res = await fetch(
        `${API}/api/admin/ai-decisions?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setDecisions(
        data.decisions?.filter(
          d => d.type === "SUPPLIER_IMPORT"
        ) || []
      );

    } catch (err) {
      console.error("Decision load error:", err);
    }

  }

  /* ===============================
     DISCOVER SUPPLIERS
  =============================== */

  async function discover() {

    if (!query) return;

    try {

      const token = await user.getIdToken();

      await fetch(
        `${API}/api/admin/suppliers/discover`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productName: query })
        }
      );

      setQuery("");

      loadAll(token);

    } catch (err) {
      console.error("Discovery error:", err);
    }

  }

  /* ===============================
     LOAD ALL
  =============================== */

  async function loadAll(token) {

    await Promise.all([
      loadSupplierProducts(token),
      loadDecisions(token)
    ]);

    setLoading(false);

  }

  useEffect(() => {

    async function init() {

      if (!user) return;

      const token = await user.getIdToken();

      loadAll(token);

    }

    init();

  }, [user]);

  /* ===============================
     UI
  =============================== */

  return (
    <AdminLayout title="Suppliers">

      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          Supplier Intelligence
        </h1>

        {/* SEARCH */}
        <div className="flex gap-2 mb-6">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product (e.g. iPhone case)"
            className="flex-1 p-2 rounded bg-black border border-cyan-500/20"
          />

          <button
            onClick={discover}
            className="bg-cyan-500 px-4 py-2 rounded"
          >
            Discover
          </button>

        </div>

        {/* ===============================
            AI DECISIONS
        =============================== */}

        <h2 className="text-lg text-cyan-300 mb-3">
          AI Supplier Suggestions
        </h2>

        {decisions.length === 0 && (
          <p className="text-white/40 mb-6">
            No supplier suggestions yet
          </p>
        )}

        {decisions.map((d) => (

          <div
            key={d._id}
            className="bg-black/40 p-4 mb-3 rounded border border-cyan-500/20"
          >

            <div className="font-semibold">
              {d.suggestion.productName}
            </div>

            <div className="text-sm text-white/60">
              Supplier: {d.suggestion.supplier}
            </div>

            <div className="text-sm text-white/60">
              Price: ${d.suggestion.price}
            </div>

            <div className="text-xs text-white/40">
              {d.reason}
            </div>

          </div>

        ))}

        {/* ===============================
            SUPPLIER PRODUCTS
        =============================== */}

        <h2 className="text-lg text-cyan-300 mt-8 mb-3">
          Supplier Products
        </h2>

        {loading && (
          <p className="text-white/40">Loading...</p>
        )}

        {!loading && products.length === 0 && (
          <p className="text-white/40">
            No supplier products found
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          {products.map((p) => (

            <div
              key={p._id}
              className="bg-black/40 p-4 rounded border border-cyan-500/20"
            >

              <div className="font-semibold">
                {p.productName}
              </div>

              <div className="text-sm text-white/60">
                {p.supplier}
              </div>

              <div className="text-sm text-cyan-400">
                ${p.price}
              </div>

              <div className="text-xs text-white/40">
                Rating: {p.rating} | Shipping: {p.shippingDays}d
              </div>

            </div>

          ))}

        </div>

      </div>

    </AdminLayout>
  );
}