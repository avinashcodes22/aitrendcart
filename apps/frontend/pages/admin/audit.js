import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AuditPage() {

  const { user } = useAuth(); // ✅ FIXED

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const token = await user.getIdToken(); // ✅ FIXED

      const res = await fetch(
        `${API}/api/admin/audit`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Audit error:", text);
        setLogs([]);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setLogs(data.logs || []);
      } else {
        setLogs([]);
      }

    } catch (err) {

      console.error("Audit load error:", err);
      setLogs([]);

    }

    setLoading(false);
  }

  /* ===============================
     INITIAL LOAD + AUTO REFRESH
  =============================== */

  useEffect(() => {

    if (!user) return;

    loadLogs();

    const interval = setInterval(() => {
      loadLogs();
    }, 10000);

    return () => clearInterval(interval);

  }, [user]);

  return (

    <AdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          Security & Activity Logs
        </h1>

        {loading && (
          <p className="text-white/60">
            Loading audit logs...
          </p>
        )}

        {!loading && logs.length === 0 && (
          <p className="text-white/60">
            No audit activity yet
          </p>
        )}

        {!loading && logs.length > 0 && (

          <div className="overflow-x-auto border border-cyan-500/20 rounded-xl">

            <table className="min-w-full text-sm">

              <thead className="bg-cyan-500/10 text-cyan-300">

                <tr>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Entity</th>
                  <th className="p-3 text-left">Details</th>
                  <th className="p-3 text-left">IP</th>
                  <th className="p-3 text-left">Time</th>
                </tr>

              </thead>

              <tbody>

                {logs.map((log) => (

                  <tr
                    key={log._id}
                    className="border-t border-cyan-500/10 hover:bg-cyan-500/5"
                  >

                    <td className="p-3 text-white font-medium">
                      {log.action || "-"}
                    </td>

                    <td className="p-3 text-white">
                      {log.entity ? (
                        <div>
                          <div>{log.entity}</div>
                          {log.entityId && (
                            <div className="text-xs text-white/50">
                              {log.entityId}
                            </div>
                          )}
                        </div>
                      ) : "-"}
                    </td>

                    <td className="p-3 text-white">
                      {log.details ? (
                        <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : "-"}
                    </td>

                    <td className="p-3 text-white">
                      {log.ip || "-"}
                    </td>

                    <td className="p-3 text-white/80">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </AdminLayout>

  );
}