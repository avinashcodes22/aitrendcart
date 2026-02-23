import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  }, [token]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Orders</h1>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((o) => (
        <div
          key={o._id}
          style={{ borderBottom: "1px solid #333", marginBottom: 12 }}
        >
          <div><strong>Order ID:</strong> {o._id}</div>
          <div><strong>Total:</strong> ₹{o.amount}</div>
          <div><strong>Status:</strong> {o.status}</div>
        </div>
      ))}
    </div>
  );
}
