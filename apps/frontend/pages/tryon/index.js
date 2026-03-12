import { useState } from "react";

export default function TryOnPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  async function handleUpload() {
    if (!file) return alert("Select a photo");

    const form = new FormData();
    form.append("photo", file);

    const res = await fetch(
      "http://localhost:5000/api/tryon/upload",
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();
    if (data.ok) setResult(data.imageUrl);
  }

  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h1>AI Virtual Try-On</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload Photo
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview</h3>
          <img src={result} style={{ maxWidth: 300 }} />
        </div>
      )}
    </div>
  );
}
