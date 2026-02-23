import { useState } from "react";

export default function VisualSearch() {
  const [results, setResults] = useState([]);

  async function search() {
    const res = await fetch(
      "http://localhost:5000/api/visual-search",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: "Sarees" })
      }
    );

    setResults(await res.json());
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl mb-4">Visual Search</h1>

      <button
        onClick={search}
        className="bg-cyan-500 px-4 py-2 rounded"
      >
        Find Similar Sarees
      </button>

      <div className="mt-6 space-y-3">
        {results.map(p => (
          <div key={p._id}>
            {p.name} — ₹{p.price}
          </div>
        ))}
      </div>
    </div>
  );
}
