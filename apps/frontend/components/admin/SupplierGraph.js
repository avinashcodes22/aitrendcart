import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function SupplierGraph() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [range, setRange] = useState(7);

  async function load() {
    if (!token) return;

    const res = await fetch(
      `http://localhost:5000/api/admin/supplier-graph?range=${range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const json = await res.json();
    setData(json || []);
  }

  useEffect(() => {
    load();
  }, [range, token]);

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5 glow-card">

      {/* TITLE */}
      <div className="flex justify-between mb-4">
        <div className="text-cyan-400 font-bold">
          Supplier Activity
        </div>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="bg-black border border-white/20 text-sm px-2 rounded"
        >
          <option value={1}>Today</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* GRAPH */}
      {data.length === 0 && (
        <div className="text-white/40 text-sm">
          No supplier activity
        </div>
      )}

      <div className="space-y-3">
        {data.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm">
              <span>{s.name}</span>
              <span>{s.products}</span>
            </div>

            <div className="h-2 bg-white/10 rounded">
              <div
                className="h-2 bg-cyan-400 rounded"
                style={{
                  width:
                    Math.min(s.products, 100) + "%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}