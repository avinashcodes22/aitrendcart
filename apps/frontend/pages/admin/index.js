import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import AdminPredictionChart from "../../components/admin/AdminPredictionChart";
import SupplierGraph from "../../components/admin/SupplierGraph";

const Trend3D = dynamic(
  () => import("../../components/admin/AdminTrend3D"),
  { ssr: false }
);

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD ADMIN STATS
  =============================== */
  async function loadStats() {
    if (!token) return;

    try {
      const res = await fetch(
        `${API}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      setStats(data);
      setError("");
    } catch (err) {
      setError("Failed to load stats");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStats();

    const interval = setInterval(() => {
      loadStats();
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);

  if (loading)
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="p-6 text-white">
            Loading dashboard...
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

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              AItrendcart Control Center
            </h1>
            <p className="text-white/60">
              AI-powered commerce intelligence
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Products"
              value={stats?.totalProducts}
            />
            <StatCard
              title="Orders Today"
              value={stats?.ordersToday}
            />
            <StatCard
              title="Suppliers Active"
              value={stats?.activeSuppliers}
            />
            <StatCard
              title="AI Jobs Running"
              value={stats?.aiJobsRunning}
            />
          </div>

          {/* 3D TREND HEATMAP */}
          <Card>
            <SectionTitle title="AI Trend Heatmap" />
            <div className="h-[420px]">
              <Trend3D />
            </div>
          </Card>

          {/* AI PREDICTION CHART */}
          <Card>
            <SectionTitle title="AI Sales Prediction" />
            <AdminPredictionChart />
          </Card>

          {/* SUPPLIER GRAPH */}
          <Card>
            <SectionTitle title="Supplier Performance" />
            <SupplierGraph />
          </Card>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickCard
              title="Sync Suppliers"
              link="/admin/suppliers"
            />
            <QuickCard
              title="Run AI 2D→3D"
              link="/admin/ai-jobs"
            />
            <QuickCard
              title="License Scanner"
              link="/admin/license"
            />
          </div>

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

/* =============================== */

function StatCard({ title, value }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5 glow-card">
      <div className="text-white/60 text-sm">
        {title}
      </div>
      <div className="text-2xl font-bold text-cyan-400 mt-2">
        {value ?? 0}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-6 glow-card">
      {children}
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="font-bold text-cyan-400 mb-4 text-lg">
      {title}
    </div>
  );
}

function QuickCard({ title, link }) {
  return (
    <a
      href={link}
      className="bg-black/40 border border-cyan-500/20 rounded-xl p-5 hover:scale-105 transition glow-card"
    >
      <div className="font-semibold text-cyan-400">
        {title}
      </div>
    </a>
  );
}