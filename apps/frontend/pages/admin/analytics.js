import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AnalyticsPage() {

  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {

    async function load() {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/analytics`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const d = await res.json();
      setData(d);

    }

    if (user) load();

  }, [user]);

  if (!data) {
    return (
      <AdminLayout>
        <p className="p-6 text-white/60">
          Loading analytics...
        </p>
      </AdminLayout>
    );
  }

  /* ===============================
     CHART DATA
  =============================== */

  const chartData = Object.entries(data.dailyRevenue || {})
    .map(([date, value]) => ({
      date,
      revenue: value
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (

    <AdminLayout>

      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          Revenue Dashboard
        </h1>

        {/* ================= STATS ================= */}

        <div className="grid grid-cols-3 gap-6">

          <Card title="Total Revenue" value={`₹${data.totalRevenue}`} />
          <Card title="Orders" value={data.totalOrders} />
          <Card title="Avg Order" value={`₹${data.avgOrderValue}`} />

        </div>

        {/* ================= AI REVENUE ================= */}

        <h2 className="mt-10 mb-4 text-cyan-400 text-xl">
          AI Revenue Prediction
        </h2>

        <div className="grid grid-cols-3 gap-6">

          <Card title="Avg Daily" value={`₹${data.prediction?.avgDaily || 0}`} />
          <Card title="Next 7 Days" value={`₹${data.prediction?.next7Days || 0}`} />
          <Card title="Next 30 Days" value={`₹${data.prediction?.next30Days || 0}`} />

        </div>

        {/* ================= CHART ================= */}

        <h2 className="mt-10 mb-4 text-cyan-400 text-xl">
          Revenue Trend
        </h2>

        <div className="bg-black/40 p-4 rounded-xl">

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06b6d4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* ================= TOP PRODUCTS ================= */}

        <h2 className="mt-10 text-cyan-400 text-xl">
          Top Products
        </h2>

        <div className="mt-4 space-y-2">

          {data.topProducts.map((p, i) => (

            <div
              key={i}
              className="bg-black/40 p-3 rounded-xl flex justify-between"
            >
              <span>{p.name}</span>
              <span className="text-cyan-400">{p.qty}</span>
            </div>

          ))}

        </div>

        {/* ================= PRODUCT AI ================= */}

        <h2 className="mt-10 text-cyan-400 text-xl">
          AI Product Predictions
        </h2>

        <div className="mt-4 space-y-3">

          {data.productPredictions.map((p, i) => (

            <div
              key={i}
              className="bg-black/40 p-4 rounded-xl flex justify-between"
            >

              <div>
                <div className="font-semibold">
                  {p.name}
                </div>

                <div className="text-xs text-white/50">
                  Sold: {p.totalSold}
                </div>
              </div>

              <div className="text-right">

                <div className="text-cyan-400 text-sm">
                  7d: {p.next7Days}
                </div>

                <div className="text-white/60 text-xs">
                  30d: {p.next30Days}
                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </AdminLayout>

  );
}

/* ===============================
   CARD
=============================== */

function Card({ title, value }) {

  return (
    <div className="bg-black/40 p-4 rounded-xl">
      <p className="text-white/60 text-sm">{title}</p>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );

}