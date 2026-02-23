import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="rounded border bg-white p-4">
      <img
        src={product.images?.[0] || "/admin/placeholder.svg"}
        alt={product.name}
        className="h-48 w-full object-cover"
      />

      <h3 className="mt-2 font-semibold">{product.name}</h3>
      <p className="text-sm">₹{product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="mt-3 w-full rounded bg-black px-3 py-2 text-white"
      >
        Add to Cart
      </button>
    </div>
  );
}
