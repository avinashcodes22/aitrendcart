import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AiJobsPage() {
  const { token } = useAuth();

  const [stats, setStats] = useState(null);
  const [failedJobs, setFailedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD AI STATUS
  =============================== */
  async function loadStats() {
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/admin/ai/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
     LOAD FAILED JOBS (SAFE)
  =============================== */
  async function loadFailed() {
    if (!token) return;

    try {
      const res = await fetch(`${API}/api/admin/ai/failed`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed");

      // 🔐 HARDENED DATA EXTRACTION
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

  useEffect(() => {
    if (!token) return;

    loadStats();
    loadFailed();

    const interval = setInterval(() => {
      loadStats();
      loadFailed();
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  /* ===============================
     RETRY JOB
  =============================== */
  async function retryJob(id) {
    try {
      await fetch(`${API}/api/admin/ai/retry/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadStats();
      loadFailed();
    } catch (err) {
      console.error("Retry error:", err.message);
    }
  }

  /* ===============================
     REMOVE JOB
  =============================== */
  async function removeJob(id) {
    try {
      await fetch(`${API}/api/admin/ai/remove/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      loadStats();
      loadFailed();
    } catch (err) {
      console.error("Remove error:", err.message);
    }
  }

  /* ===============================
     PAUSE / RESUME
  =============================== */
  async function pauseQueue() {
    await fetch(`${API}/api/admin/ai/pause`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("AI Engine Paused");
  }

  async function resumeQueue() {
    await fetch(`${API}/api/admin/ai/resume`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("AI Engine Resumed");
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6 text-white max-w-6xl mx-auto space-y-8">

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">
              🤖 AI Engine Control Panel
            </h1>
            <p className="text-white/60">
              Monitor AI conversion jobs and queue
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-red-400">
              {error}
            </div>
          )}

          {/* STATS */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard title="Waiting" value={stats.waiting} />
              <StatCard title="Running" value={stats.active} />
              <StatCard title="Completed" value={stats.completed} />
              <StatCard title="Failed" value={stats.failed} />
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button
              onClick={pauseQueue}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Pause AI
            </button>

            <button
              onClick={resumeQueue}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Resume AI
            </button>
          </div>

          {/* FAILED JOBS */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              Failed Jobs
            </h2>

            {loading && <p>Loading...</p>}

            {!loading && failedJobs.length === 0 && (
              <p className="text-white/60">
                No failed jobs 🎉
              </p>
            )}

            <div className="space-y-4">
              {Array.isArray(failedJobs) &&
                failedJobs.map((j) => (
                  <div
                    key={j.id || j._id}
                    className="border border-white/10 rounded-xl p-4"
                  >
                    <div className="font-semibold">
                      Job #{j.id || j._id}
                    </div>

                    <div className="text-sm text-red-400">
                      {j.failedReason || "Unknown error"}
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => retryJob(j.id)}
                        className="bg-cyan-500 px-3 py-1 rounded text-sm"
                      >
                        Retry
                      </button>

                      <button
                        onClick={() => removeJob(j.id)}
                        className="bg-gray-600 px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5 glow-card">
      <div className="text-white/60 text-sm">{title}</div>
      <div className="text-2xl font-bold text-cyan-400 mt-2">
        {value ?? 0}
      </div>
    </div>
  );
}