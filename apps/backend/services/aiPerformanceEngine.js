import Product from "../models/Product.js";

export async function evaluateProductPerformance() {

  console.log("📊 AI Performance Engine");

  const products = await Product.find({});

  for (const p of products) {

    const revenue = p.revenue || 0;
    const profit = p.profit || 0;
    const units = p.unitsSold || 0;

    let score = 0;
    let status = "stable";

    if (profit > 5000) score += 40;
    else if (profit > 1000) score += 20;

    if (units > 50) score += 30;
    else if (units > 10) score += 15;

    if (revenue > 10000) score += 30;
    else if (revenue > 3000) score += 15;

    if (score >= 70) status = "scaling";
    else if (score >= 40) status = "stable";
    else status = "dropping";

    p.aiPerformance = {
      score,
      status,
      lastEvaluatedAt: new Date()
    };

    await p.save();

    console.log(`📈 ${p.name} → ${status}`);

  }

}