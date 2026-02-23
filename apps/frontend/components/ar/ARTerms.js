export default function ARTerms({ onAccept }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-[#050816] p-6 rounded-xl max-w-md text-white">
        <h2 className="text-cyan-400 mb-3">Important Notice</h2>

        <p className="text-sm mb-3">
          Virtual try-on is for visualization only. Actual fit, size, and color may vary.
        </p>

        <p className="text-sm mb-3">
          Uploaded photos are processed securely and not stored permanently.
        </p>

        <button
          onClick={onAccept}
          className="bg-cyan-500 px-4 py-2 rounded mt-3"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}