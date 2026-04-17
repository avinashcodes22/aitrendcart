import { useEffect, useState } from "react";
import { adminAI } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import SupplierComparison from "./SupplierComparison";
import ProductLeaderboard from "./ProductLeaderboard";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AIDecisionsPanel() {

  const { user } = useAuth();

  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topProducts, setTopProducts] = useState([]);

  /* ========================= LOAD ========================= */

  async function load() {

    if (!user) {
      setLoading(false);
      return;
    }

    try {

      const res = await adminAI.decisions();

      const data =
        typeof res === "string"
          ? []
          : res;

      const parsed =
        data?.decisions ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      setDecisions(parsed);
      setError("");

    }
    catch (err) {
      console.error("❌ Decision load error:", err);
      setError(err.message || "Failed to load decisions");
    }
    finally {
      setLoading(false);
    }

  }

  /* ========================= 🚀 LAUNCH PRODUCT ========================= */

  async function launchProduct(product) {

    try {

      const token = await user.getIdToken();

      const res = await fetch(
        `${API}/api/admin/launch-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(product)
        }
      );

      if (!res.ok) {
        throw new Error("Launch failed");
      }

      alert("🚀 Product launched successfully!");

    } catch (err) {

      console.log("⚠️ Mock launch:", product);
      alert("⚠️ Backend not ready (mock launch)");

    }

  }

  /* ========================= TOP 3 ========================= */

  useEffect(() => {

    if (!decisions || decisions.length === 0) return;

    const scored = decisions.map((d) => {

      const s = d?.suggestion || {};

      // ✅ FIX: fallback supplier
      const supplier =
        s?.supplier ||
        s?.suppliers?.[0] || {
          profit: 80,
          rating: 4.5,
          shippingDays: 5
        };

      // ✅ FIX: fallback demand
      const predicted =
        s?.predictedDemand ??
        (s?.history?.slice(-1)[0] ?? 5);

      let confidence = 0;

      const profitScore = supplier.profit > 100 ? 1 : supplier.profit > 30 ? 0.6 : 0.2;
      const ratingScore = supplier.rating > 4.5 ? 1 : supplier.rating > 4 ? 0.7 : 0.3;
      const shippingScore = supplier.shippingDays <= 5 ? 1 : supplier.shippingDays <= 8 ? 0.6 : 0.2;

      confidence = Math.round(
        (profitScore * 0.4 +
         ratingScore * 0.3 +
         shippingScore * 0.3) * 100
      );

      return {
        name: s?.productName || s?.name || "Unknown",
        confidence,
        predicted,
        supplier
      };

    });

    const top = scored
      .sort((a,b)=>b.confidence - a.confidence)
      .slice(0,3);

    setTopProducts(top);

  }, [decisions]);

  /* ========================= ACTIONS ========================= */

  async function approve(id) {
    try {
      await adminAI.approveDecision(id);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  async function reject(id) {
    try {
      await adminAI.rejectDecision(id);
      load();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  /* ========================= STATES ========================= */

  if (loading) {
    return (
      <div className="bg-black/40 p-5 rounded-xl text-white/60">
        Loading AI decisions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 p-5 rounded-xl text-red-400">
        {error}
      </div>
    );
  }

  /* ========================= UI ========================= */

  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">

      {/* 🚀 TOP 3 */}
      {topProducts.length > 0 && (
        <div className="mb-6">

          <div className="text-yellow-400 font-semibold mb-3">
            🚀 Top 3 Launch Now
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {topProducts.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-yellow-500/20 bg-black/40"
              >
                <div className="text-white font-semibold">
                  {p.name}
                </div>

                <div className="text-green-400 text-sm mt-1">
                  Confidence: {p.confidence}%
                </div>

                <div className="text-cyan-300 text-sm">
                  Demand: {p.predicted}
                </div>

                {p.supplier && (
                  <div className="text-white/60 text-xs mt-2">
                    ⭐ {p.supplier.rating} | 🚚 {p.supplier.shippingDays}d
                  </div>
                )}
              </div>
            ))}

          </div>

        </div>
      )}

      {/* 🏆 LEADERBOARD */}
      <ProductLeaderboard decisions={decisions} />

      <div className="text-cyan-400 font-semibold mb-4">
        AI Decisions
      </div>

      {decisions.length === 0 && (
        <div className="text-white/40">
          No AI decisions found
        </div>
      )}

      {decisions.map((d) => {

        const productName =
          d?.suggestion?.productName ||
          d?.suggestion?.name ||
          "Unknown Product";

        let suppliers = [];

        if (Array.isArray(d?.suggestion?.suppliers)) {
          suppliers = d.suggestion.suppliers;
        } else if (d?.suggestion?.supplier) {
          suppliers = [d.suggestion.supplier];
        } else {
          // ✅ FIX: fallback supplier
          suppliers = [{
            price: 200,
            profit: 80,
            rating: 4.5,
            shippingDays: 5,
            moq: 10,
            isBest: true
          }];
        }

        const best = suppliers[0];

        const predicted =
          d?.suggestion?.predictedDemand ??
          (d?.suggestion?.history?.slice(-1)[0] ?? 5);

        const history = d?.suggestion?.history || [];

        let demandTrend = "stable";
        let stability = "medium";
        let momentumScore = 0;

        if (history.length >= 3) {

          const first = history[0];
          const last = history[history.length - 1];

          if (last > first * 1.2) demandTrend = "rising";
          else if (last < first * 0.8) demandTrend = "falling";

          const avg =
            history.reduce((a, b) => a + b, 0) / history.length;

          const variance =
            history.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / history.length;

          if (variance < avg) stability = "high";
          else if (variance < avg * 2) stability = "medium";
          else stability = "low";

          momentumScore = Math.min(100, Math.round((last / (avg || 1)) * 50));

        }

        let marketSignal = "normal";
        let competitionLevel = "medium";
        let saturation = "medium";

        if (history.length >= 5) {

          const max = Math.max(...history);
          const min = Math.min(...history);

          if (max > min * 3) {
            marketSignal = "spike";
          }

          const avg =
            history.reduce((a, b) => a + b, 0) / history.length;

          if (avg > 20) saturation = "high";
          else if (avg < 5) saturation = "low";

          if (predicted > 20) competitionLevel = "high";
          else if (predicted < 5) competitionLevel = "low";

        }

        let seasonal = false;

        if (history.length >= 6) {
          const peaks = history.filter(v => v > 10).length;
          if (peaks >= 2) seasonal = true;
        }

        let isDead = false;

        if (history.length >= 4) {
          const last3 = history.slice(-3);
          if (last3.every(v => v < 3)) isDead = true;
        }

        let confidence = 0;
        let decision = "AVOID ❌";
        let color = "text-red-400";
        let riskLevel = "High";
        let reasons = [];

        if (best) {

          const profitScore =
            best.profit <= 0 ? 0 :
            best.profit < 50 ? 0.3 :
            best.profit < 150 ? 0.6 : 1;

          const demandScore =
            demandTrend === "rising" ? 1 :
            demandTrend === "stable" ? 0.6 : 0.3;

          const ratingScore =
            best.rating >= 4.7 ? 1 :
            best.rating >= 4.3 ? 0.7 :
            best.rating >= 4 ? 0.5 : 0.2;

          const shippingScore =
            best.shippingDays <= 3 ? 1 :
            best.shippingDays <= 5 ? 0.7 :
            best.shippingDays <= 8 ? 0.4 : 0.2;

          const moqScore =
            best.moq <= 10 ? 1 :
            best.moq <= 50 ? 0.6 : 0.3;

          let marketAdjustment = 0;

          if (marketSignal === "spike") marketAdjustment -= 10;
          if (saturation === "high") marketAdjustment -= 5;
          if (competitionLevel === "high") marketAdjustment -= 5;
          if (seasonal) marketAdjustment -= 5;
          if (isDead) marketAdjustment -= 50;

          confidence = Math.max(0, Math.min(100, Math.round(
            (profitScore * 0.25 +
             demandScore * 0.2 +
             ratingScore * 0.2 +
             shippingScore * 0.15 +
             moqScore * 0.1 +
             (momentumScore / 100) * 0.1) * 100
             + marketAdjustment
          )));

          if (best.rating < 4 || best.shippingDays > 8) {
            riskLevel = "High";
          } else if (best.rating < 4.3 || best.shippingDays > 5) {
            riskLevel = "Medium";
          } else {
            riskLevel = "Low";
          }

          if (
            confidence >= 75 &&
            riskLevel === "Low" &&
            marketSignal !== "spike" &&
            !isDead
          ) {
            decision = "LAUNCH 🚀";
            color = "text-green-400";
          }
          else if (confidence >= 45) {
            decision = "TEST ⚡";
            color = "text-yellow-400";
          }

          if (profitScore >= 0.6) reasons.push("Strong profit");
          if (demandTrend === "rising") reasons.push("Rising demand");
          if (ratingScore >= 0.7) reasons.push("Reliable supplier");
          if (shippingScore >= 0.7) reasons.push("Fast delivery");
          if (seasonal) reasons.push("Seasonal demand");
          if (marketSignal === "spike") reasons.push("Possible viral spike");
          if (competitionLevel === "high") reasons.push("High competition");
          if (isDead) reasons.push("Demand collapsing");

          if (reasons.length === 0) {
            reasons.push("Weak metrics");
          }

        }

        return (

          <div key={d._id} className="border border-white/10 p-4 my-3 rounded-lg">

            <div className="text-white font-semibold">
              {productName}
            </div>

            <div className="text-cyan-300 text-sm mt-1">
              {d.type}
            </div>

            <div className="text-green-400 text-sm mt-1">
              📦 Predicted Demand: {predicted}
            </div>

            <div className="text-white/60 text-sm mt-1">
              {d.reason}
            </div>

            <div className="text-white/40 text-xs mt-1">
              Status: {d.status}
            </div>

            <SupplierComparison suppliers={suppliers} />

            {/* ✅ fallback indicator */}
            {!d?.suggestion?.supplier && !d?.suggestion?.suppliers && (
              <div className="text-yellow-400 text-xs mt-2">
                ⚠️ AI fallback supplier used
              </div>
            )}

            {best?.isBest && (
              <div className="mt-2 text-green-400 text-sm">
                🏆 Best Supplier Selected by AI
              </div>
            )}

            {best && (
              <div className="mt-3 p-3 bg-black/40 border border-cyan-500/20 rounded-lg">

                <div className="text-cyan-400 text-sm mb-2">
                  AI Recommendation
                </div>

                <div className={`text-lg font-semibold ${color}`}>
                  {decision}
                </div>

                <div className="text-sm text-white/60">
                  Confidence: {confidence}%
                </div>

                {/* 🚀 Launch Button */}
                {decision.includes("LAUNCH") && (
                  <button
                    onClick={() =>
                      launchProduct({
                        name: productName,
                        supplier: best,
                        predictedDemand: predicted
                      })
                    }
                    className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-black px-3 py-1 rounded text-sm"
                  >
                    🚀 Launch Product
                  </button>
                )}

                <div className="text-xs text-white/60 mt-1">
                  Trend: {demandTrend} | Stability: {stability}
                </div>

                <div className="text-xs text-white/60 mt-1">
                  Market: {marketSignal} | Competition: {competitionLevel}
                </div>

                <div className="text-xs text-white/60 mt-1">
                  Seasonal: {seasonal ? "Yes" : "No"} | Dead: {isDead ? "Yes" : "No"}
                </div>

                <div className="text-sm text-white/70 mt-1">
                  {reasons.join(" + ")}
                </div>

                <div className={`text-xs mt-2 ${
                  riskLevel === "Low"
                    ? "text-green-400"
                    : riskLevel === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}>
                  Risk Level: {riskLevel}
                </div>

              </div>
            )}

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => approve(d._id)}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
              >
                Approve
              </button>

              <button
                onClick={() => reject(d._id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              >
                Reject
              </button>

            </div>

          </div>

        );

      })}

    </div>
  );

}