import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = "http://localhost:5000";

export default function AIProductPanel({ product, onClose }) {

  const { getFreshToken } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD REAL AI DATA
  =============================== */

  useEffect(() => {

    async function load() {
      try {

        const token = await getFreshToken();
        if (!token) return;

        const res = await fetch(
          `${API}/api/admin/product-insight?name=${product.name}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const json = await res.json();

        setData(json);

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    }

    if (product) load();

  }, [product]);

  if (!product) return null;

  return (

    <div className="fixed right-0 top-0 h-full w-[350px] bg-black/95 border-l border-cyan-500/20 p-5 z-50">

      <button
        onClick={onClose}
        className="text-white/50 hover:text-white mb-4"
      >
        ✕ Close
      </button>

      <h2 className="text-cyan-400 text-lg font-bold mb-4">
        {product.name}
      </h2>

      {loading && (
        <div className="text-white/40">Loading AI...</div>
      )}

      {data && (

        <div className="space-y-4 text-sm">

          {/* SALES */}
          <div>
            📊 Sales History: {data.history.length} points
          </div>

          {/* PREDICTION */}
          <div>
            🤖 Predicted Demand:
            <span className="text-cyan-400 ml-2">
              {data.predictedSales}
            </span>
          </div>

          {/* SUPPLIER */}
          {data.supplier ? (
            <div className="space-y-2">

              <div className="text-green-400">
                ✅ Supplier Found
              </div>

              <div>
                🏭 {data.supplier.supplier}
              </div>

              <div>
                💰 Cost: ₹{data.supplier.price}
              </div>

              <div>
                📦 MOQ: {data.supplier.moq}
              </div>

              <div>
                🚚 Shipping: {data.supplier.shippingDays} days
              </div>

              <div>
                ⭐ Rating: {data.supplier.rating}
              </div>

            </div>
          ) : (
            <div className="text-red-400">
              No supplier found
            </div>
          )}

          {/* PROFIT */}
          {data.profit !== null && (
            <div className="text-yellow-400">
              💰 Estimated Profit: ₹{data.profit}
            </div>
          )}

          {/* ACTIONS */}
          <div className="space-y-2 pt-4">

            <button className="w-full bg-blue-500 py-2 rounded">
              Import Supplier
            </button>

            <button className="w-full bg-green-500 py-2 rounded">
              Launch Product
            </button>

          </div>

        </div>

      )}

    </div>
  );
}