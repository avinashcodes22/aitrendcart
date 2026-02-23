import dynamic from "next/dynamic";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminGuard from "../../components/admin/AdminGuard";

const AITrendBlob = dynamic(
  () => import("../../components/admin/AITrendBlob"),
  { ssr: false }
);

export default function Dashboard() {
  return (
    <AdminGuard>
      <AdminLayout>

        <h1 className="text-3xl mb-8 text-cyan-400">
          AItrendcart Command Center
        </h1>

        {/* ================= STATS ================= */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <Card title="Products Synced" value="1247" />
          <Card title="Orders Today" value="58" />
          <Card title="AI Jobs Pending" value="12" />
          <Card title="License Flags" value="3" />

        </div>

        {/* ================= AI TREND VISUALIZATION ================= */}
        <h2 className="text-xl text-cyan-300 mb-3">
          AI Trend Visualization
        </h2>

        <AITrendBlob />

      </AdminLayout>
    </AdminGuard>
  );
}

/* ================= CARD ================= */
function Card({ title, value }) {
  return (
    <div className="p-6 rounded-xl bg-black/40 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
      <div className="text-sm text-white/60">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}