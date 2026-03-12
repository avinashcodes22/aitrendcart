import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI SAFETY GUARD
==================================== */

export async function checkAISafety(engineName){

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  const totalDecisions = await AiDecision.countDocuments({
    createdAt: { $gte: oneHourAgo }
  });

  const engineDecisions = await AiDecision.countDocuments({
    reason: { $regex: engineName, $options: "i" },
    createdAt: { $gte: oneHourAgo }
  });

  /* GLOBAL LIMIT */

  if(totalDecisions > 200){

    throw new Error(
      "AI Safety Guard: too many decisions created in last hour"
    );

  }

  /* ENGINE LIMIT */

  if(engineDecisions > 50){

    throw new Error(
      `AI Safety Guard: ${engineName} exceeded decision limit`
    );

  }

}