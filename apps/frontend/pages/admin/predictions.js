import { useEffect, useState } from "react";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function PredictionsPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API}/api/admin/predictions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6 text-white max-w-4xl mx-auto">

          <h1 className="text-2xl font-bold mb-6 text-cyan-400">
            🔮 AI Trend Predictions
          </h1>

          {data.length === 0 && (
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
                  {p.predictedSales}
                </div>
              </div>
            ))}
          </div>

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}