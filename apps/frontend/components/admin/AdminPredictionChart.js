import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AdminPredictionChart() {
  const { token } = useAuth();

  const [data, setData] = useState([]);
  const [range, setRange] = useState("30d");

  async function load() {
    if (!token) return;

    const res = await fetch(
      `${API}/api/admin/predictions?range=${range}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const json = await res.json();
    setData(json || []);
  }

  useEffect(() => {
    load();
  }, [token, range]);

  return (
    <div className="space-y-4">

      {/* FILTER MENU */}
      <div className="flex gap-3">
        {[
          { label: "Today", val: "today" },
          { label: "Last 7 Days", val: "7d" },
          { label: "Last 30 Days", val: "30d" },
        ].map(btn => (
          <button
            key={btn.val}
            onClick={() => setRange(btn.val)}
            className={`px-3 py-1 rounded ${
              range === btn.val
                ? "bg-cyan-500"
                : "bg-gray-700"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* CHART */}
      <div className="h-[320px] bg-black/40 p-4 rounded-xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line dataKey="sales" />
            <Line dataKey="predictedSales" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}