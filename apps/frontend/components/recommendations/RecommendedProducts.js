import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function RecommendedProducts() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/recommend", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(setItems)
      .catch(console.error);
  }, [token]);

  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-3">
        Recommended for you
      </h2>

      <div className="space-y-2">
        {items.map(p => (
          <div key={p._id}>
            {p.name} — ₹{p.price}
          </div>
        ))}
      </div>
    </div>
  );
}
