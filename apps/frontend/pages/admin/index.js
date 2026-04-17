import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";

import { useAuth } from "../../context/AuthContext";

import AdminPredictionChart from "../../components/admin/AdminPredictionChart";
import AdminTopPredictions from "../../components/admin/AdminTopPredictions"; // ✅ NEW

import SupplierGraph from "../../components/admin/SupplierGraph";
import WorkerStatusCard from "../../components/admin/WorkerStatusCard";
import AIExecutionCard from "../../components/admin/AIExecutionCard";

import { adminApi, adminAI } from "../../lib/api";

/* ===============================
   DYNAMIC 3D LOAD
=============================== */
const Trend3D = dynamic(
  () => import("../../components/admin/AdminTrend3D"),
  { ssr: false }
);

export default function AdminDashboard() {

  const { user, loading: authLoading } = useAuth();

  const [stats, setStats] = useState({});
  const [aiHealth, setAiHealth] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD AI SYSTEM
  =============================== */

  async function loadAISystem() {

    try {

      const health = await adminAI.healthLogs();

      const parsed =
        health?.data ||
        health;

      setAiHealth(parsed || {});

    } catch (err) {

      console.error("AI system load error", err);
      setAiHealth({});

    }

  }

  /* ===============================
     LOAD STATS
  =============================== */

  async function loadStats() {

    try {

      const data = await adminApi.stats();

      const parsed =
        data?.stats ||
        data?.data ||
        data;

      setStats(parsed || {});
      setError("");

    } catch (err) {

      console.error(err);
      setError("Failed to load stats");

    } finally {

      setLoading(false);

    }

  }

  /* =============================== */

  useEffect(() => {

    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    loadStats();
    loadAISystem();

    const interval = setInterval(() => {
      loadStats();
      loadAISystem();
    }, 15000);

    return () => clearInterval(interval);

  }, [user, authLoading]);

  /* =============================== */

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

          {/* HEADER */}
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              AItrendcart Control Center
            </h1>
            <p className="text-white/60">
              AI-powered commerce intelligence
            </p>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Products" value={stats?.totalProducts} />
            <StatCard title="Orders Today" value={stats?.ordersToday} />
            <StatCard title="Suppliers Active" value={stats?.activeSuppliers} />
            <StatCard title="AI Jobs Running" value={stats?.aiJobsRunning} />
          </div>

          {/* AI SYSTEM */}
          <Card>
            <SectionTitle title="AI System Status" />

            <div className="grid md:grid-cols-3 gap-6">

              <WorkerStatusCard />
              <AIExecutionCard />

              <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
                <div className="text-cyan-400 font-semibold mb-2">
                  AI Health
                </div>

                <div className="text-sm text-white/70">
                  Worker: {aiHealth?.worker ?? "unknown"}
                </div>

                <div className="text-sm text-white/70">
                  Decisions: {aiHealth?.decisions ?? 0}
                </div>

                <div className="text-sm text-white/70">
                  Jobs Failed: {aiHealth?.failed ?? 0}
                </div>

              </div>

            </div>
          </Card>

          {/* 3D TREND */}
          <Card>
            <SectionTitle title="AI Trend Heatmap" />
            <div className="h-[420px]">
              <Trend3D />
            </div>
          </Card>

          {/* PREDICTION */}
          <Card>
            <SectionTitle title="AI Sales Prediction" />
            <AdminPredictionChart />
          </Card>

          {/* 🔥 NEW SECTION */}
          <Card>
            <SectionTitle title="Top AI Predicted Products" />
            <AdminTopPredictions />
          </Card>

          {/* SUPPLIERS */}
          <Card>
            <SectionTitle title="Supplier Performance" />
            <SupplierGraph />
          </Card>

        </div>

      </AdminLayout>
    </AdminGuard>
  );
}

/* =============================== */

function StatCard({ title, value }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
      <div className="text-white/60 text-sm">{title}</div>
      <div className="text-2xl font-bold text-cyan-400 mt-2">
        {value ?? 0}
      </div>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-6">
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