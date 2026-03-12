import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AuditPage() {

  const { token } = useAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {

    try {

      const res = await fetch(
        `${API}/api/admin/audit`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        setLogs(data.logs || []);
      }

    } catch (err) {

      console.error("Audit load error:", err);

    }

    setLoading(false);
  }

  /* ===============================
     INITIAL LOAD + AUTO REFRESH
  =============================== */

  useEffect(() => {

    if (!token) return;

    loadLogs();

    const interval = setInterval(() => {
      loadLogs();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);

  }, [token]);

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

                    {/* ACTION */}
                    <td className="p-3 text-white font-medium">
                      {log.action || "-"}
                    </td>

                    {/* ENTITY */}
                    <td className="p-3 text-white">

                      {log.entity ? (
                        <div>

                          <div>
                            {log.entity}
                          </div>

                          {log.entityId && (
                            <div className="text-xs text-white/50">
                              {log.entityId}
                            </div>
                          )}

                        </div>
                      ) : "-"}

                    </td>

                    {/* DETAILS */}
                    <td className="p-3 text-white">

                      {log.details ? (
                        <pre className="text-xs whitespace-pre-wrap text-cyan-200">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      ) : "-"}

                    </td>

                    {/* IP */}
                    <td className="p-3 text-white">
                      {log.ip || "-"}
                    </td>

                    {/* TIME */}
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