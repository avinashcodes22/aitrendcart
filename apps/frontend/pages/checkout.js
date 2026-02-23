import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../lib/orderCreate"; // IMPORTANT: new file
import { useRouter } from "next/router";

export default function CheckoutPage() {
  const { token, user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  if (!cart || cart.items.length === 0) {
    return <p style={{ padding: 20 }}>Cart is empty</p>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    try {
      if (!token) {
        alert("Please login again");
        return;
      }

      const address = {
        fullName: user?.email || "Test User",
        phone: "9999999999",
        addressLine1: "Street",
        city: "City",
        state: "State",
        postalCode: "123456",
        country: "India"
      };

      // 1️⃣ Create order in backend
      const order = await createOrder(token, address);

      // 2️⃣ Store orderId for payment step
      localStorage.setItem(
        "aitrendcart_order_id",
        order.orderId
      );

      // 3️⃣ Redirect to payment page
      router.push("/payment");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed. Please try again.");
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Checkout</h1>

      {cart.items.map((item) => (
        <div
          key={item.productId}
          style={{ marginBottom: 8 }}
        >
          {item.name} × {item.quantity} — ₹
          {item.price * item.quantity}
        </div>
      ))}

      <hr />
      <h2>Total: ₹{total}</h2>

      <button
        onClick={handleCheckout}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#06b6d4",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: 6,
          cursor: "pointer"
        }}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
