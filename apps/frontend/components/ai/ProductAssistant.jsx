import { useState } from "react";

export default function ProductAssistant({ product }) {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askAI() {

    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {

      const res = await fetch(
        "http://localhost:5000/api/ai/product-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            product,
            question
          })
        }
      );

      const data = await res.json();

      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("AI could not generate a response.");
      }

    } catch (err) {

      console.error(err);
      setAnswer("Error contacting AI service.");

    }

    setLoading(false);
  }

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-4 text-cyan-300">
        AI Product Assistant
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        Ask anything about this product.
      </p>

      <div className="flex gap-2">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Is this good for daily use?"
          className="flex-1 px-4 py-2 rounded-lg bg-black border border-white/10 text-white"
        />

        <button
          onClick={askAI}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition"
        >
          Ask
        </button>

      </div>

      {loading && (
        <div className="mt-4 text-sm text-gray-400">
          AI thinking...
        </div>
      )}

      {answer && (
        <div className="mt-4 p-4 bg-black/60 border border-white/10 rounded-lg text-sm">
          {answer}
        </div>
      )}

    </div>
  );
}