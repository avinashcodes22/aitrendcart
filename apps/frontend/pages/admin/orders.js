import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function OrdersAdmin() {

  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD ORDERS
  =============================== */

  async function loadOrders() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Orders error:", text);
        setError("Failed to load orders");
        return;
      }

      const data = await res.json();

      const parsed =
        data?.orders ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setOrders(parsed);

    } catch (err) {

      console.error(err);
      setError("Server error");

    } finally {

      setLoading(false);

    }

  }

  /* ===============================
     UPDATE STATUS
  =============================== */

  async function updateStatus(orderId, status) {

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        }
      );

      if (!res.ok) {
        console.error("Status update failed");
        return;
      }

      /* 🔥 REFRESH */
      loadOrders();

    } catch (err) {

      console.error("Status error:", err);

    }

  }

  useEffect(() => {
    loadOrders();
  }, [user]);

  /* ===============================
     UI
  =============================== */

  return (

    <AdminLayout title="Orders">

      <div className="p-6">

        <h2 className="text-xl font-bold mb-6 text-cyan-400">
          Orders Dashboard
        </h2>

        {loading && (
          <p className="text-white/60">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-white/60">
            No orders found
          </p>
        )}

        {!loading && orders.length > 0 && (

          <div className="overflow-x-auto border border-cyan-500/20 rounded-xl">

            <table className="min-w-full text-sm">

              <thead className="bg-cyan-500/10 text-cyan-300">

                <tr>
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Date</th>
                </tr>

              </thead>

              <tbody>

                {orders.map((o) => (

                  <tr
                    key={o._id}
                    className="border-t border-cyan-500/10 hover:bg-cyan-500/5"
                  >

                    {/* ORDER ID */}
                    <td className="p-3 text-white">
                      {o._id}
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-3 text-white">
                      {o.user?.email || "User"}
                    </td>

                    {/* AMOUNT */}
                    <td className="p-3 text-white">
                      ₹{o.amount || 0}
                    </td>

                    {/* STATUS + ACTIONS */}
                    <td className="p-3 space-y-2">

                      <span className={`px-2 py-1 text-xs rounded
                        ${
                          o.status === "delivered"
                            ? "bg-green-500/20 text-green-400"
                            : o.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : o.status === "shipped"
                            ? "bg-blue-500/20 text-blue-400"
                            : o.status === "processing"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-red-500/20 text-red-400"
                        }
                      `}>
                        {o.status || "unknown"}
                      </span>

                      <div className="flex flex-wrap gap-1">

                        <button
                          onClick={() => updateStatus(o._id, "processing")}
                          className="text-xs bg-yellow-600 px-2 py-1 rounded"
                        >
                          Process
                        </button>

                        <button
                          onClick={() => updateStatus(o._id, "shipped")}
                          className="text-xs bg-blue-600 px-2 py-1 rounded"
                        >
                          Ship
                        </button>

                        <button
                          onClick={() => updateStatus(o._id, "delivered")}
                          className="text-xs bg-green-600 px-2 py-1 rounded"
                        >
                          Deliver
                        </button>

                        <button
                          onClick={() => updateStatus(o._id, "cancelled")}
                          className="text-xs bg-red-600 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>

                      </div>

                    </td>

                    {/* ADDRESS */}
                    <td className="p-3 text-xs text-white">

                      {o.address ? (

                        <div className="space-y-1">

                          <div className="font-semibold text-cyan-300">
                            {o.address.fullName}
                          </div>

                          <div>
                            {o.address.phone}
                          </div>

                          <div className="text-white/70">
                            {o.address.addressLine1}
                          </div>

                          <div className="text-white/50">
                            {o.address.city}, {o.address.state}
                          </div>

                          <div className="text-white/50">
                            {o.address.postalCode}, {o.address.country}
                          </div>

                        </div>

                      ) : "-"}

                    </td>

                    {/* DATE */}
                    <td className="p-3 text-white/80 text-xs">
                      {o.createdAt
                        ? new Date(o.createdAt).toLocaleString()
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