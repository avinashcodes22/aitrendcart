import AIError from "../models/AIError.js";

/* ====================================
   MAIN ERROR LOGGER
==================================== */

export async function logAiError(engine, error) {

  try {

    await AIError.create({

      engine,
      message: error?.message || "Unknown AI error",
      stack: error?.stack || "",
      severity: "error"

    });

    console.error("🚨 AI Error Logged:", engine, error?.message);

  } catch (e) {

    console.error("AI error logger failed:", e.message);

  }

}

/* ====================================
   BACKWARD COMPATIBILITY
==================================== */

export const logAIError = logAiError;