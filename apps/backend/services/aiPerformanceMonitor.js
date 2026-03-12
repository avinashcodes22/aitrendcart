import AiPerformance from "../models/AiPerformance.js";

/* ====================================
   AI PERFORMANCE LOGGER
==================================== */

export async function logAIExecution(
engine,
startTime,
error=null
){

  const executionTime = Date.now() - startTime;

  await AiPerformance.create({

    engine,
    status:error ? "failed" : "success",
    executionTime,
    error:error?.message

  });

}