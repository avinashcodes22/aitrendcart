import { useState } from "react";
import Link from "next/link";

export default function VisualSearchPage() {

  const [image, setImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {

    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    try {

      const res = await fetch(
        "http://localhost:5000/api/visual-search",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      if (data.success) {
        setResults(data.products || []);
      } else {
        alert(data.error || "Visual search failed");
      }

    } catch (err) {

      console.error(err);
      alert("Visual search failed");

    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-bold mb-8 text-cyan-400">
          AI Visual Search
        </h1>

        {/* Upload */}

        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="mb-6"
        />

        {/* Preview */}

        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-48 rounded-xl mb-8"
          />
        )}

        {/* Loading */}

        {loading && (
          <p className="text-gray-400">
            AI analyzing image...
          </p>
        )}

        {/* Results */}

        {results.length > 0 && (

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            {results.map(p => (

              <Link
                key={p._id}
                href={`/product/${p.slug || p._id}`}
                className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 hover:scale-105 transition"
              >

                <img
                  src={p.images?.[0] || "/admin/placeholder.svg"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded"
                />

                <div className="mt-3 font-semibold">
                  {p.name}
                </div>

                <div className="text-cyan-300">
                  ₹{p.price}
                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}