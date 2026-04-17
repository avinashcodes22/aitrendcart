import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function LicenseAdmin() {

  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productId, setProductId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [verifying, setVerifying] = useState(false);

  /* ===============================
     LOAD REPORTS
  =============================== */

  async function loadReports() {

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/license/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setReports(Array.isArray(data) ? data : []);

    } catch (err) {

      console.error("License load error:", err);
      setError("Failed to load reports");

    } finally {
      setLoading(false);
    }

  }

  /* ===============================
     VERIFY LICENSE
  =============================== */

  async function verifyLicense() {

    if (!productId && !imageUrl) {
      alert("Enter productId or imageUrl");
      return;
    }

    setVerifying(true);

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/license/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId,
            imageUrl
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      /* refresh reports */
      await loadReports();

      /* clear inputs */
      setProductId("");
      setImageUrl("");

    } catch (err) {

      console.error("Verify error:", err);
      alert(err.message);

    } finally {

      setVerifying(false);

    }

  }

  useEffect(() => {
    if (user) loadReports();
  }, [user]);

  /* ===============================
     UI
  =============================== */

  return (

    <AdminLayout title="License">

      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          License Checker
        </h1>

        {/* ===============================
            VERIFY PANEL
        =============================== */}

        <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-xl mb-6">

          <div className="text-cyan-300 mb-3">
            Verify Product License
          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Product ID (optional)"
              className="p-2 rounded bg-black border border-white/20 flex-1"
            />

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              className="p-2 rounded bg-black border border-white/20 flex-1"
            />

            <button
              onClick={verifyLicense}
              disabled={verifying}
              className="bg-cyan-500 px-4 py-2 rounded"
            >
              {verifying ? "Verifying..." : "Verify"}
            </button>

          </div>

        </div>

        {/* ===============================
            STATUS
        =============================== */}

        {loading && (
          <p className="text-white/60">
            Loading reports...
          </p>
        )}

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        {!loading && reports.length === 0 && (
          <p className="text-white/60">
            No reports yet
          </p>
        )}

        {/* ===============================
            REPORTS LIST
        =============================== */}

        <div className="space-y-3">

          {reports.map((r) => (

            <div
              key={r._id}
              className={`p-4 rounded border ${
                r.flagged
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-green-500/20 bg-black/40"
              }`}
            >

              <div className="flex justify-between">

                <div className="font-semibold">
                  {r.productId || "Custom Image"}
                </div>

                <div
                  className={
                    r.flagged
                      ? "text-red-400"
                      : "text-green-400"
                  }
                >
                  {r.flagged ? "FLAGGED" : "SAFE"}
                </div>

              </div>

              <div className="text-sm text-white/60 mt-1">
                Confidence: {Math.round((r.confidence || 0) * 100)}%
              </div>

              {r.reason && (
                <div className="text-xs text-white/40 mt-1">
                  {r.reason}
                </div>
              )}

              {r.sources?.length > 0 && (
                <div className="text-xs text-cyan-400 mt-2">
                  Sources: {r.sources.join(", ")}
                </div>
              )}

            </div>

          ))}

        </div>

      </div>

    </AdminLayout>
  );
}