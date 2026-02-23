import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) {
    return <p style={{ padding: 20 }}>Loading cart...</p>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p style={{ padding: 20 }}>Your cart is empty.</p>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <h1>Your Cart</h1>

      {cart.items.map((item) => (
        <div
          key={item.productId}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}

      <hr />
      <h2>Total: ₹{total}</h2>
    </div>
  );
}
