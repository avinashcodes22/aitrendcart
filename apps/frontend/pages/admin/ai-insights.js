import { useEffect, useState } from "react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import { adminAI } from "../../lib/api";

export default function AIInsightsPage() {

  const { user } = useAuth();

  const [restock, setRestock] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pricing, setPricing] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD AI DATA (CLEAN)
  =============================== */

  async function loadData() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const [restockData, inventoryData, pricingData] =
        await Promise.all([
          adminAI.restock(),
          adminAI.inventory(),
          adminAI.pricing()
        ]);

      // ✅ NO MANUAL MAPPING HERE
      setRestock(restockData || []);
      setInventory(inventoryData || []);
      setPricing(pricingData || []);

      setError("");

    } catch (err) {

      console.error(err);
      setError("Failed to load AI insights");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {
    loadData();
  }, [user]);

  /* ===============================
     EXECUTE RESTOCK
  =============================== */

  async function executeRestock(item) {

    try {

      await adminAI.executeRestock({
        productId: item.productId,
        reorderQty: item.reorderQty
      });

      alert("Supplier Order Generated Successfully");

    } catch {

      alert("Restock execution failed");

    }

  }

  /* ===============================
     APPLY PRICE
  =============================== */

  async function applyPrice(item) {

    try {

      await adminAI.applyPrice({
        productId: item.productId,
        newPrice: item.newPrice
      });

      alert("Price Updated Successfully");

    } catch {

      alert("Price update failed");

    }

  }

  /* ===============================
     UI (UNCHANGED)
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

          <Section title="Auto Restock Recommendations">
            {restock.length === 0 && <Empty text="No restock needed" />}
            {restock.map((r, i) => (
              <Card key={i}>
                <div className="font-semibold text-cyan-400">{r.productName}</div>
                <div className="text-sm text-white/70">Stock: {r.currentStock}</div>
                <div className="text-sm text-white/70">Reorder: {r.reorderQty}</div>
                <div className="text-sm text-white/70">Cost: ₹{r.estimatedCost}</div>

                <button
                  onClick={() => executeRestock(r)}
                  className="mt-3 bg-green-500 px-3 py-1 rounded text-sm"
                >
                  Approve
                </button>
              </Card>
            ))}
          </Section>

          <Section title="Inventory Alerts">
            {inventory.length === 0 && <Empty text="No alerts" />}
            {inventory.map((i, idx) => (
              <Card key={idx}>
                {i.product} — {i.status}
              </Card>
            ))}
          </Section>

          <Section title="Dynamic Pricing">
            {pricing.length === 0 && <Empty text="No changes needed" />}
            {pricing.map((p, i) => (
              <Card key={i}>
                <div>{p.name}</div>
                <div>Old Price: ₹{p.oldPrice}</div>
                <div>Suggested Price: ₹{p.newPrice}</div>

                <button
                  onClick={() => applyPrice(p)}
                  className="mt-3 bg-yellow-500 px-3 py-1 rounded text-sm"
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
      <h2 className="text-xl mb-4 text-cyan-300">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-xl">
      {children}
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-white/50 text-sm">{text}</div>;
}