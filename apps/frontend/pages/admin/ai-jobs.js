import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AdminGuard from "../../components/admin/AdminGuard";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AiJobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/admin/ai-jobs", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setJobs)
      .catch(console.error);
  }, [token]);

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-6 text-white max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">
            AI Conversion Jobs
          </h1>

          {jobs.length === 0 && (
            <p>No conversion jobs yet</p>
          )}

          <div className="space-y-4">
            {jobs.map(j => (
              <div
                key={j._id}
                className="border border-white/10 rounded-xl p-4"
              >
                <div className="font-semibold">
                  {j.name}
                </div>

                <div className="text-sm text-white/60">
                  Status: {j.conversionStatus}
                </div>

                {j.model3dUrl && (
                  <a
                    href={j.model3dUrl}
                    target="_blank"
                    className="text-cyan-400 text-sm underline"
                  >
                    View 3D Model
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
