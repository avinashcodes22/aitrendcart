import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function SupplierGraph() {

  const { token } = useAuth();

  const [data, setData] = useState([]);

  async function load() {

    if (!token) return;

    try {

      const res = await fetch(
        `${API}/api/admin/supplier-performance`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const json = await res.json();

      setData(Array.isArray(json) ? json : []);

    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {
    load();
  }, [token]);

  return (

    <div className="space-y-4">

      {data.length === 0 && (
        <div className="text-white/40">
          No supplier activity
        </div>
      )}

      {data.map((s) => (

        <div key={s.name} className="space-y-1">

          <div className="flex justify-between text-sm text-white/80">
            <span>{s.name}</span>
            <span>₹{s.revenue}</span>
          </div>

          <div className="h-2 bg-white/10 rounded">

            <div
              className="h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded"
              style={{
                width: `${Math.min(s.score, 100)}%`
              }}
            />

          </div>

          <div className="text-xs text-white/40 flex justify-between">
            <span>{s.orders} orders</span>
          </div>

        </div>

      ))}

    </div>

  );

}