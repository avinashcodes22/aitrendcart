import AiPerformance from "../models/AiPerformance.js";

/* ====================================
   AI PERFORMANCE LOGGER
   (Execution-based logging)
==================================== */

export async function logAIExecution(
  engine,
  startTime,
  error = null
) {

  const executionTime = Date.now() - startTime;

  await AiPerformance.create({
    engine,
    status: error ? "failed" : "success",
    executionTime,
    error: error?.message
  });

}

/* ====================================
   COMMERCE BRAIN PERFORMANCE LOGGER
==================================== */

export async function recordAiPerformance({
  engine = "unknown",
  decisionsCreated = 0,
  executionTime = 0
} = {}) {

  await AiPerformance.create({
    engine,
    status: "success",
    executionTime,
    decisionsCreated
  });

}

/* ====================================
   BACKWARD COMPATIBILITY
==================================== */

export const logAIPerformance = recordAiPerformance;