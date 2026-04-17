import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AdminTopPredictions() {

  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [range, setRange] = useState("30d");
  const [loadingAction, setLoadingAction] = useState(null);

  /* ===============================
     LOAD DATA (UPGRADED)
  =============================== */

  async function load() {

    if (!user) return;

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/predictions?range=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const json = await res.json();

      const data =
        Array.isArray(json)
          ? json
          : json?.products || [];

      /* 🔥 ENRICH WITH AI INSIGHT */
      const enriched = await Promise.all(

        data.map(async (p) => {

          try {

            const res = await fetch(
              `${API}/api/admin/product-insight?name=${encodeURIComponent(p.name)}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            const insight = await res.json();

            return {
              ...p,
              supplier: insight?.supplier || null,
              profit: insight?.profit ?? null,
              margin: insight?.supplier?.margin ?? null,
              score: insight?.supplier?.score ?? null
            };

          } catch {
            return p;
          }

        })

      );

      setProducts(enriched);

    } catch (err) {
      console.error("Prediction load error:", err);
    }

  }

  useEffect(() => {
    load();
  }, [user, range]);

  /* ===============================
     FILTER VALID DATA
  =============================== */

  const validProducts = products.filter(
    (p) =>
      p &&
      typeof p.predictedSales === "number" &&
      p.predictedSales > 0
  );

  /* ===============================
     AI DECISION LOGIC (NEW)
  =============================== */

  function getDecision(p) {

    if (!p.supplier) return "⚠ No Supplier";

    if (p.margin > 40 && p.predictedSales > 15)
      return "🔥 Launch Now";

    if (p.margin > 20 && p.predictedSales > 8)
      return "🟡 Test Product";

    return "❌ Risky";

  }

  /* ===============================
     ACTIONS
  =============================== */

  async function importProduct(product) {

    try {

      setLoadingAction(product.name);

      const token = await user.getIdToken();

      await fetch(`${API}/api/admin/discovery/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productName: product.name
        })
      });

      alert("✅ Product import started");

    } catch (err) {
      console.error(err);
      alert("❌ Import failed");
    } finally {
      setLoadingAction(null);
    }

  }

  async function launchProduct(product) {

    try {

      setLoadingAction(product.name);

      const token = await user.getIdToken();

      await fetch(`${API}/api/admin/product-launch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name
        })
      });

      alert("🚀 Launch started");

    } catch (err) {
      console.error(err);
      alert("❌ Launch failed");
    } finally {
      setLoadingAction(null);
    }

  }

  /* ===============================
     UI
  =============================== */

  return (

    <div>

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        {["today", "7d", "30d"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded ${
              range === r
                ? "bg-cyan-500 text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* NO DATA */}
      {validProducts.length === 0 && (
        <div className="text-white/50">
          No strong AI predictions yet
        </div>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {validProducts.map((p, i) => {

          const predicted = p.predictedSales;

          const risk =
            predicted > 20
              ? "LOW"
              : predicted > 10
              ? "MEDIUM"
              : "HIGH";

          const decision = getDecision(p);

          return (

            <div
              key={i}
              className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 hover:border-cyan-400 transition"
            >

              {/* NAME */}
              <p className="text-white text-sm">
                {p.name}
              </p>

              {/* SALES */}
              <p className="text-cyan-400 text-xl font-bold mt-1">
                {predicted}
              </p>

              {/* SUPPLIER */}
              {p.supplier && (
                <p className="text-xs text-white/60 mt-1">
                  {p.supplier.supplier}
                </p>
              )}

              {/* PROFIT */}
              {p.profit !== null && (
                <p className="text-xs text-green-400">
                  ₹{p.profit}
                </p>
              )}

              {/* MARGIN */}
              {p.margin !== null && (
                <p className="text-xs text-cyan-300">
                  {Math.round(p.margin)}% margin
                </p>
              )}

              {/* SCORE */}
              {p.score && (
                <p className="text-xs text-purple-400">
                  Score: {Math.round(p.score)}
                </p>
              )}

              {/* DECISION */}
              <p className="text-xs mt-1 text-yellow-300">
                {decision}
              </p>

              {/* RISK */}
              <p
                className={`text-xs mt-1 ${
                  risk === "LOW"
                    ? "text-green-400"
                    : risk === "MEDIUM"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                Risk: {risk}
              </p>

              {/* BAR */}
              <div className="mt-2 h-1 bg-gray-700 rounded">
                <div
                  className="h-1 bg-cyan-400 rounded"
                  style={{
                    width: `${Math.min(predicted * 5, 100)}%`
                  }}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">

                <button
                  onClick={() => importProduct(p)}
                  disabled={loadingAction === p.name}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs px-2 py-1 rounded"
                >
                  {loadingAction === p.name ? "..." : "Import"}
                </button>

                <button
                  onClick={() => launchProduct(p)}
                  disabled={loadingAction === p.name}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-xs px-2 py-1 rounded"
                >
                  Launch
                </button>

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}