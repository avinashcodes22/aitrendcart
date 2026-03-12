import AdminLayout from "../../components/admin/AdminLayout";

export default function SettingsAdmin() {
  return (
    <AdminLayout title="Settings">
      <h2 className="text-xl font-bold mb-4">Platform Settings</h2>
      <p>Configure AI engine, suppliers, and security.</p>
    </AdminLayout>
  );
}