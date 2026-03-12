import AdminLayout from "../../components/admin/AdminLayout";

export default function OrdersAdmin() {
  return (
    <AdminLayout title="Orders">
      <h2 className="text-xl font-bold mb-4">Orders Dashboard</h2>
      <p>Here you will manage customer orders, payments, and shipping.</p>
    </AdminLayout>
  );
}