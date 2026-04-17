export default function ProductLeaderboard({ decisions = [] }) {

  const ranked = decisions.map((d) => {

    const name =
      d?.suggestion?.productName ||
      d?.suggestion?.name ||
      "Product";

    const predicted = d?.suggestion?.predictedDemand || 0;

    let supplier =
      d?.suggestion?.supplier ||
      (d?.suggestion?.suppliers?.[0] || null);

    const profit = supplier?.profit || 0;
    const rating = supplier?.rating || 0;
    const shipping = supplier?.shippingDays || 10;

    let score = 0;

    if (profit > 150) score += 40;
    else if (profit > 50) score += 20;

    if (predicted > 15) score += 30;
    else if (predicted > 5) score += 15;

    if (rating >= 4.5) score += 20;
    if (shipping <= 5) score += 10;

    let decision = "AVOID ❌";

    if (score >= 70) decision = "LAUNCH 🚀";
    else if (score >= 40) decision = "TEST ⚡";

    return { name, score, decision };

  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5 mb-6">

      <div className="text-cyan-400 font-semibold mb-4">
        🏆 Top Opportunities
      </div>

      {ranked.map((p, i) => (

        <div
          key={i}
          className="flex justify-between items-center py-2 border-b border-white/10"
        >

          <div className="text-white">
            {i + 1}. {p.name}
          </div>

          <div className="flex items-center gap-4">

            <div className="text-sm text-white/60">
              {p.score}%
            </div>

            <div className={`text-sm ${
              p.decision.includes("LAUNCH")
                ? "text-green-400"
                : p.decision.includes("TEST")
                ? "text-yellow-400"
                : "text-red-400"
            }`}>
              {p.decision}
            </div>

          </div>

        </div>

      ))}

    </div>
  );

}