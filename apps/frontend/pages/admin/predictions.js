import { useEffect, useState } from "react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function PredictionsPage() {

  const { user } = useAuth(); // ✅ FIXED

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    async function load() {

      if (!user) return;

      try {

        const token = await user.getIdToken(); // ✅ FIXED

        const res = await fetch(
          `${API}/api/admin/predictions`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Predictions error:", text);
          setError("Failed to load predictions");
          return;
        }

        const json = await res.json();

        /* 🔥 HANDLE MULTIPLE RESPONSE TYPES */
        const parsed =
          json?.predictions ||
          json?.data ||
          (Array.isArray(json) ? json : []);

        setData(parsed);

      } catch (err) {

        console.error(err);
        setError("Server error");

      }

    }

    load();

  }, [user]);

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6 text-white max-w-4xl mx-auto">

          <h1 className="text-2xl font-bold mb-6 text-cyan-400">
            🔮 AI Trend Predictions
          </h1>

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!error && data.length === 0 && (
            <p>No prediction data yet</p>
          )}

          <div className="space-y-4">
            {data.map((p) => (
              <div
                key={p.name}
                className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 flex justify-between"
              >
                <div>{p.name}</div>
                <div className="text-cyan-400">
                  {p.predictedSales ?? 0}
                </div>
              </div>
            ))}
          </div>

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}