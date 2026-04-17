import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAI } from "../../lib/api";

export default function WorkerStatusCard() {

  const { user } = useAuth();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStatus() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const data = await adminAI.healthLogs();

      setStatus(data || {});
      setError("");

    } catch (err) {

      console.error("Worker status error:", err);
      setError("Failed to load worker");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!user) return;

    loadStatus();

    const interval = setInterval(() => {
      loadStatus();
    }, 5000); // 🔥 slightly relaxed (less spam)

    return () => clearInterval(interval);

  }, [user]);

  /* ======================= */

  if (loading) {
    return (
      <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
        Loading worker...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 border border-red-500/20 rounded-xl p-5 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">

      <div className="text-cyan-400 font-semibold mb-2">
        Worker Status
      </div>

      <div className="text-sm text-white/70">
        Status:{" "}
        <span
          className={
            status?.worker === "online"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {status?.worker ?? "offline"}
        </span>
      </div>

      <div className="text-sm text-white/70">
        Jobs Processed: {status?.decisions ?? 0}
      </div>

      <div className="text-sm text-white/70">
        Last Seen:{" "}
        {status?.lastHeartbeat
          ? new Date(status.lastHeartbeat).toLocaleTimeString()
          : "Never"}
      </div>

    </div>
  );

}