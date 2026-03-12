export default function ProductCard({ product }) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition">

      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-60 object-cover"
      />

      <div className="p-4">
        <h3 className="text-white text-sm">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          ₹{product.price}
        </p>
      </div>

    </div>
  );
}