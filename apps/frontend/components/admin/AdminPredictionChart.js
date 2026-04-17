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

  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [range, setRange] = useState("30d");
  const [error, setError] = useState("");

  async function load() {

    if (!user) return;

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/predictions?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error("API failed");

      const json = await res.json();

      /* ✅ FIX HERE */
      const parsed = json?.chart || [];

      /* Fallback if empty */
      if (!parsed.length) {

        console.warn("⚠ No data, using fallback");

        setData([
          { date: "Mon", sales: 10, predictedSales: 12 },
          { date: "Tue", sales: 20, predictedSales: 18 },
          { date: "Wed", sales: 15, predictedSales: 17 },
          { date: "Thu", sales: 30, predictedSales: 28 },
          { date: "Fri", sales: 25, predictedSales: 26 }
        ]);

        return;
      }

      setData(parsed);

    } catch (err) {

      console.error(err);
      setError("Failed to load chart");

    }

  }

  useEffect(() => {
    load();
  }, [user, range]);

  return (

    <div>

      {error && <p className="text-red-400">{error}</p>}

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-3">
        {["today", "7d", "30d"].map(r => (
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

      <div className="h-[320px] bg-black/40 p-4 rounded-xl">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />

            {/* Actual */}
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#00F5FF"
              strokeWidth={2}
              dot={false}
            />

            {/* Prediction */}
            <Line
              type="monotone"
              dataKey="predictedSales"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}