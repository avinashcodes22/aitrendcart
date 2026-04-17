import AiDecision from "../models/AiDecision.js";

/* ====================================
   AI SAFETY GUARD
   Prevents runaway AI decision creation
==================================== */

export async function aiSafetyGuard(engineName = "unknown") {

try{

const oneHourAgo = new Date(
Date.now() - 60 * 60 * 1000
);

/* ===============================
GLOBAL DECISION LIMIT
=============================== */

const totalDecisions = await AiDecision.countDocuments({
createdAt: { $gte: oneHourAgo }
});

if(totalDecisions > 200){

throw new Error(
"AI Safety Guard: too many decisions created in last hour"
);

}

/* ===============================
ENGINE DECISION LIMIT
=============================== */

if(engineName && engineName !== "unknown"){

const engineDecisions = await AiDecision.countDocuments({
engine: engineName,
createdAt: { $gte: oneHourAgo }
});

if(engineDecisions > 50){

throw new Error(
`AI Safety Guard: ${engineName} exceeded decision limit`
);

}

}

}
catch(err){

console.error(
"AI Safety Guard triggered:",
err.message
);

throw err;

}

}

/* ====================================
   BACKWARD COMPATIBILITY
==================================== */

export const checkAISafety = aiSafetyGuard;