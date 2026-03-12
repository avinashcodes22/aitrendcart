import AiAction from "../models/AiAction.js";

/* =====================================================
   CREATE AI SUGGESTION
===================================================== */

export async function createAiSuggestion(type, payload){

  const action = await AiAction.create({
    type,
    payload,
    status: "pending"
  });

  return action;

}