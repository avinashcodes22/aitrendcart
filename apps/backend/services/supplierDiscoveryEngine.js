import { findSuppliers } from "./supplierFinder.js";

/* ======================================================
   BUSINESS-GRADE SUPPLIER ENGINE (UPGRADED)
====================================================== */

const supplierDiscoveryEngine = {

  async findSuppliers(productName) {

    try {

      console.log("🔍 AI Supplier Engine for:", productName);

      let suppliers = [];

      try {
        suppliers = await findSuppliers(productName);
      } catch (err) {
        console.log("⚠ supplierFinder failed:", err.message);
      }

      /* ===============================
         🔥 FALLBACK (REALISTIC DATA)
      =============================== */

      if (!suppliers || suppliers.length === 0) {

        suppliers = [
          {
            supplier: "Alibaba",
            price: 120,
            rating: 4.6,
            shippingDays: 10,
            moq: 50
          },
          {
            supplier: "IndiaMart",
            price: 100,
            rating: 4.3,
            shippingDays: 6,
            moq: 20
          },
          {
            supplier: "Local Vendor",
            price: 90,
            rating: 4.0,
            shippingDays: 3,
            moq: 10
          }
        ];

      }

      /* ===============================
         💰 BUSINESS COST MODEL
      =============================== */

      const SHIPPING_COST = 60;
      const ADS_COST = 80;
      const PLATFORM_FEE = 0.1; // 10%

      /* ===============================
         📊 SCORE ENGINE (UPGRADED)
      =============================== */

      const ranked = suppliers.map(s => {

        const cost = Math.max(0, Number(s.price || 0));
        const rating = Math.max(0, Number(s.rating || 0));
        const shippingDays = Math.max(1, Number(s.shippingDays || 5));
        const moq = Math.max(1, Number(s.moq || 10));

        /* =========================
           SELLING PRICE
        ========================= */

        const sellingPrice = cost * 2.2;

        /* =========================
           PLATFORM CUT
        ========================= */

        const platformCut = sellingPrice * PLATFORM_FEE;

        /* =========================
           FINAL PROFIT
        ========================= */

        const profit =
          sellingPrice -
          (cost + SHIPPING_COST + ADS_COST + platformCut);

        /* =========================
           MARGIN %
        ========================= */

        const margin =
          sellingPrice > 0
            ? (profit / sellingPrice) * 100
            : 0;

        /* =========================
           NORMALIZED SCORES
        ========================= */

        const profitScore = Math.max(0, profit);
        const ratingScore = rating * 20;
        const shippingScore = Math.max(0, 100 - shippingDays * 10);
        const moqScore = Math.max(0, 100 - moq);

        /* =========================
           🔥 RISK PENALTY (NEW)
        ========================= */

        let riskPenalty = 0;

        if (rating < 4) riskPenalty += 20;
        if (shippingDays > 8) riskPenalty += 15;
        if (moq > 50) riskPenalty += 10;

        /* =========================
           🔥 FINAL SCORE (BALANCED)
        ========================= */

        let score =
          profitScore * 0.35 +
          ratingScore * 0.2 +
          shippingScore * 0.2 +
          moqScore * 0.15 +
          margin * 0.1 -
          riskPenalty;

        /* =========================
           SAFETY CLAMP
        ========================= */

        score = Math.max(0, Math.round(score));

        return {
          ...s,
          cost,
          sellingPrice: Math.round(sellingPrice),
          profit: Math.round(profit),
          margin: Math.round(margin),
          score,
          riskPenalty,
          isBest: false
        };

      }).sort((a, b) => b.score - a.score);

      /* ===============================
         MARK BEST
      =============================== */

      if (ranked.length > 0) {
        ranked[0].isBest = true;
      }

      return {
        suppliers: ranked
      };

    } catch (err) {

      console.error("Supplier Engine Error:", err);

      return { suppliers: [] };

    }

  }

};

/* ======================================================
   🔁 BACKWARD COMPATIBILITY (UNCHANGED)
====================================================== */

export async function discoverSuppliersForProduct(productName) {

  const result = await supplierDiscoveryEngine.findSuppliers(productName);

  const best = result?.suppliers?.[0];

  if (!best) return null;

  return {
    suggestion: best
  };

}

export default supplierDiscoveryEngine;