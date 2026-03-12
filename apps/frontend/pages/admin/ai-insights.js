import { useEffect, useState } from "react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AIInsightsPage() {
  const { token } = useAuth();

  const [restock, setRestock] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pricing, setPricing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD AI DATA
  =============================== */
  async function loadData() {
    if (!token) return;

    try {
      const [r1, r2, r3] = await Promise.all([
        fetch(`${API}/api/admin/restock-ai`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/inventory-ai`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API}/api/admin/pricing-ai`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const restockData = await r1.json();
      const inventoryData = await r2.json();
      const pricingData = await r3.json();

      if (!r1.ok || !r2.ok || !r3.ok)
        throw new Error("Failed to load AI data");

      setRestock(Array.isArray(restockData) ? restockData : []);
      setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      setPricing(Array.isArray(pricingData) ? pricingData : []);

      setError("");
    } catch (err) {
      setError("Failed to load AI insights");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [token]);

  /* ===============================
     EXECUTE RESTOCK
  =============================== */
  async function executeRestock(item) {
    try {
      const res = await fetch(
        `${API}/api/admin/restock/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.productId,
            reorderQty: item.reorderQty,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      alert("Supplier Order Generated Successfully");
    } catch (err) {
      alert("Restock execution failed");
    }
  }

  /* ===============================
     APPLY DYNAMIC PRICE
  =============================== */
  async function applyPrice(item) {
    try {
      const res = await fetch(
        `${API}/api/admin/pricing/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.productId,
            newPrice: item.newPrice,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      alert("Price Updated Successfully");
    } catch (err) {
      alert("Price update failed");
    }
  }

  /* ===============================
     UI STATES
  =============================== */
  if (loading)
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="p-6 text-white">
            Loading AI insights...
          </div>
        </AdminLayout>
      </AdminGuard>
    );

  if (error)
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="p-6 text-red-400">
            {error}
          </div>
        </AdminLayout>
      </AdminGuard>
    );

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-10 text-white">

          <h1 className="text-3xl font-bold text-cyan-400">
            🧠 AI Insights Dashboard
          </h1>

          {/* ================= RESTOCK ================= */}
          <Section title="Auto Restock Recommendations">
            {restock.length === 0 && (
              <Empty text="No restock needed" />
            )}

            {restock.map((r, i) => (
              <Card key={i}>
                <div className="font-semibold text-cyan-400">
                  {r.productName}
                </div>

                <div className="text-sm text-white/70">
                  Current Stock: {r.currentStock}
                </div>

                <div className="text-sm text-white/70">
                  Suggested Reorder: {r.reorderQty}
                </div>

                <div className="text-sm text-white/70">
                  Estimated Cost: ₹{r.estimatedCost}
                </div>

                <button
                  onClick={() => executeRestock(r)}
                  className="mt-3 bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-sm"
                >
                  Approve & Generate Supplier Order
                </button>
              </Card>
            ))}
          </Section>

          {/* ================= INVENTORY ================= */}
          <Section title="Inventory Alerts">
            {inventory.length === 0 && (
              <Empty text="No inventory alerts" />
            )}

            {inventory.map((i, idx) => (
              <Card key={idx}>
                {i.product} — {i.status}
              </Card>
            ))}
          </Section>

          {/* ================= PRICING ================= */}
          <Section title="Dynamic Pricing Suggestions">
            {pricing.length === 0 && (
              <Empty text="No pricing adjustments needed" />
            )}

            {pricing.map((p, i) => (
              <Card key={i}>
                <div className="font-semibold text-cyan-400">
                  {p.name}
                </div>

                <div className="text-sm text-white/70">
                  Old Price: ₹{p.oldPrice}
                </div>

                <div className="text-sm text-white/70">
                  Suggested Price: ₹{p.newPrice}
                </div>

                <button
                  onClick={() => applyPrice(p)}
                  className="mt-3 bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                >
                  Approve & Apply New Price
                </button>
              </Card>
            ))}
          </Section>

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

/* =============================== */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl mb-4 text-cyan-300">
        {title}
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-xl glow-card">
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-white/50 text-sm">
      {text}
    </div>
  );
}