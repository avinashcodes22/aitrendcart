export default function Failed() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold text-red-400">
        Payment Failed
      </h1>
      <p className="mt-2">No amount was deducted.</p>
      <a href="/cart" className="inline-block mt-4 underline">
        Try Again
      </a>
    </div>
  );
}
