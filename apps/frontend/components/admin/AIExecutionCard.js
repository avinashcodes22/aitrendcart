import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { adminAI } from "../../lib/api";

export default function AIExecutionCard() {

  const { user } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {

    if (!user) return;

    try {

      const res = await adminAI.executions();

      setData(res?.executions || []);

    } catch (err) {

      console.error("Execution load error:", err);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    if (!user) return;

    load();

    const i = setInterval(load, 10000);

    return () => clearInterval(i);

  }, [user]);

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">

      <div className="text-cyan-400 font-semibold mb-3">
        Execution Trace
      </div>

      {loading && (
        <div className="text-white/50 text-sm">
          Loading executions...
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-white/40 text-sm">
          No executions yet
        </div>
      )}

      {data.map((e) => (
        <div key={e._id} className="text-xs text-white/70 mb-2">

          <div>
            {e.engine} → {e.action}
          </div>

          <div
            className={
              e.status === "success"
                ? "text-green-400"
                : e.status === "failed"
                ? "text-red-400"
                : "text-yellow-400"
            }
          >
            {e.status}
          </div>

        </div>
      ))}

    </div>
  );

}