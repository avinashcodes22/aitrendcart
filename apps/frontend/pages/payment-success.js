export default function Success() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-green-400">
        Payment Successful 🎉
      </h1>
      <p className="mt-2">Your order has been placed successfully.</p>
      <a href="/orders" className="inline-block mt-4 underline">
        View My Orders
      </a>
    </div>
  );
}
