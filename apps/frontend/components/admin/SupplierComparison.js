export default function SupplierComparison({ suppliers = [] }) {

  if (!suppliers.length) {
    return (
      <div className="text-red-400 text-sm mt-2">
        No suppliers available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 mt-3">

      {suppliers.slice(0, 3).map((s, i) => (

        <div
          key={i}
          className={`p-3 rounded-lg border ${
            s.isBest
              ? "border-green-500 bg-green-500/10"
              : "border-white/10 bg-black/30"
          }`}
        >

          <div className="text-white font-semibold">
            {s.supplier}
          </div>

          {s.isBest && (
            <div className="text-green-400 text-xs">
              🏆 Best Choice
            </div>
          )}

          <div className="text-sm text-yellow-400 mt-1">
            Cost: ₹{s.cost}
          </div>

          <div className="text-sm text-green-400">
            Profit: ₹{s.profit}
          </div>

          <div className="text-sm text-cyan-400">
            Margin: {s.margin}%
          </div>

          <div className="text-sm text-white/70">
            Rating: {s.rating}
          </div>

          <div className="text-sm text-white/70">
            Shipping: {s.shippingDays}d
          </div>

          <div className="text-sm text-white/70">
            MOQ: {s.moq}
          </div>

        </div>

      ))}

    </div>
  );

}