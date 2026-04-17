import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AiJobsPage() {

  const { user, getFreshToken } = useAuth(); // ✅ FIXED

  const [stats, setStats] = useState(null);
  const [failedJobs, setFailedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  /* ===============================
     GET HEADERS (SAFE)
  =============================== */

  async function getHeaders() {

    if (!user) return {};

    const freshToken = await getFreshToken();

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${freshToken}`
    };
  }

  /* ===============================
     RUN JOB
  =============================== */

  async function runJob(endpoint, body = {}) {

    setActionLoading(endpoint);
    setActionMsg("");

    try {

      const res = await fetch(
        `${API}/api/admin/jobs/${endpoint}`,
        {
          method: "POST",
          headers: await getHeaders(),
          body: JSON.stringify(body)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed");
      }

      setActionMsg(data.message || "Job started");

      loadStats();
      loadFailed();

    } catch (err) {

      console.error("Job trigger error:", err.message);
      setActionMsg(err.message);

    } finally {

      setActionLoading("");

    }

  }

  /* ===============================
     LOAD STATS
  =============================== */

  async function loadStats() {

    if (!user) return;

    try {

      const res = await fetch(
        `${API}/api/admin/ai/status`,
        {
          headers: await getHeaders()
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      setStats(data);

    } catch (err) {

      console.error("AI stats error:", err.message);
      setError("Failed to load AI stats");

    }

  }

  /* ===============================
     LOAD FAILED JOBS
  =============================== */

  async function loadFailed() {

    if (!user) return;

    try {

      const res = await fetch(
        `${API}/api/admin/ai/failed`,
        {
          headers: await getHeaders()
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      if (Array.isArray(data)) {
        setFailedJobs(data);
      } else if (Array.isArray(data.failed)) {
        setFailedJobs(data.failed);
      } else {
        setFailedJobs([]);
      }

      setError("");

    } catch (err) {

      console.error("AI failed jobs error:", err.message);
      setFailedJobs([]);
      setError("Failed to load failed jobs");

    }

    setLoading(false);

  }

  /* ===============================
     RETRY / REMOVE
  =============================== */

  async function retryJob(id) {

    const headers = await getHeaders();

    await fetch(
      `${API}/api/admin/ai/retry/${id}`,
      {
        method: "POST",
        headers
      }
    );

    loadStats();
    loadFailed();

  }

  async function removeJob(id) {

    const headers = await getHeaders();

    await fetch(
      `${API}/api/admin/ai/remove/${id}`,
      {
        method: "DELETE",
        headers
      }
    );

    loadStats();
    loadFailed();

  }

  /* ===============================
     PAUSE / RESUME
  =============================== */

  async function pauseQueue() {

    const headers = await getHeaders();

    await fetch(`${API}/api/admin/ai/pause`, {
      method: "POST",
      headers
    });

    alert("AI Engine Paused");

  }

  async function resumeQueue() {

    const headers = await getHeaders();

    await fetch(`${API}/api/admin/ai/resume`, {
      method: "POST",
      headers
    });

    alert("AI Engine Resumed");

  }

  /* ===============================
     INIT
  =============================== */

  useEffect(() => {

    if (!user) return;

    loadStats();
    loadFailed();

    const interval = setInterval(() => {
      loadStats();
      loadFailed();
    }, 10000);

    return () => clearInterval(interval);

  }, [user]);

  return (
    <AdminGuard>
      <AdminLayout>

        <div className="p-6 text-white max-w-6xl mx-auto space-y-8">

          <h1 className="text-3xl font-bold text-cyan-400">
            🤖 AI Engine Control Panel
          </h1>

          {error && <div className="text-red-400">{error}</div>}

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="Waiting" value={stats.waiting} />
              <StatCard title="Running" value={stats.active} />
              <StatCard title="Completed" value={stats.completed} />
              <StatCard title="Failed" value={stats.failed} />
            </div>
          )}

          <div className="flex flex-wrap gap-4">

            <button onClick={pauseQueue} className="bg-red-500 px-4 py-2 rounded">
              Pause AI
            </button>

            <button onClick={resumeQueue} className="bg-green-500 px-4 py-2 rounded">
              Resume AI
            </button>

            <button
              onClick={() =>
                runJob("run-convert", {
                  productId: "692a87de86d7777cd1f42d2b"
                })
              }
              className="bg-cyan-500 px-4 py-2 rounded"
            >
              Run 3D Conversion
            </button>

            <button
              onClick={() => runJob("run-trend-scan")}
              className="bg-purple-500 px-4 py-2 rounded"
            >
              Run Trend Scan
            </button>

            <button
              onClick={() => runJob("run-trend-predict")}
              className="bg-yellow-500 px-4 py-2 rounded"
            >
              Run Trend Prediction
            </button>

          </div>

          {actionMsg && (
            <div className="bg-black/40 border border-cyan-500/20 p-3 rounded">
              {actionMsg}
            </div>
          )}

        </div>

      </AdminLayout>
    </AdminGuard>
  );
}

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