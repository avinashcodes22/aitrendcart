import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function SettingsAdmin() {

  const { user } = useAuth();

  const [settings, setSettings] = useState({
    aiEnabled: false,
    supplierAuto: false,
    securityMode: "normal",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ===============================
     LOAD SETTINGS
  =============================== */

  async function loadSettings() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Settings load error:", text);
        return;
      }

      const data = await res.json();


      setSettings({
  aiEnabled: data?.settings?.aiEnabled ?? false,
  supplierAuto: data?.settings?.supplierAuto ?? false,
  securityMode: data?.settings?.securityMode ?? "normal",
});

    } catch (err) {

      console.error("Settings load error:", err);

    } finally {

      setLoading(false);

    }

  }

  /* ===============================
     SAVE SETTINGS
  =============================== */

  async function saveSettings() {

    if (!user) return;

    setSaving(true);

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Failed to save settings");
        return;
      }

      alert("Settings saved successfully");

    } catch (err) {

      console.error("Settings save error:", err);
      alert("Server error");

    }

    setSaving(false);

  }

  useEffect(() => {
    loadSettings();
  }, [user]);

  /* ===============================
     UI
  =============================== */

  if (loading) {
    return (
      <AdminLayout title="Settings">
        <div className="p-6 text-white/60">
          Loading settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">

      <div className="p-6 space-y-6 text-white">

        <h2 className="text-xl font-bold mb-4 text-cyan-400">
          Platform Settings
        </h2>

        {/* AI ENGINE */}
        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
          <label className="flex justify-between items-center">
            <span>AI Engine Enabled</span>
            <input
              type="checkbox"
              checked={settings.aiEnabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  aiEnabled: e.target.checked,
                })
              }
            />
          </label>
        </div>

        {/* SUPPLIER AUTO */}
        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
          <label className="flex justify-between items-center">
            <span>Auto Supplier Ordering</span>
            <input
              type="checkbox"
              checked={settings.supplierAuto}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  supplierAuto: e.target.checked,
                })
              }
            />
          </label>
        </div>

        {/* SECURITY MODE */}
        <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
          <label className="block mb-2">
            Security Mode
          </label>

          <select
            value={settings.securityMode}
            onChange={(e) =>
              setSettings({
                ...settings,
                securityMode: e.target.value,
              })
            }
            className="bg-black border border-cyan-500/20 p-2 rounded w-full"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-lg"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>

      </div>

    </AdminLayout>
  );
}