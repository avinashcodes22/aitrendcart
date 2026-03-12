import AIError from "../models/AIError.js";

export async function logAIError(engine,error){

  try{

    await AIError.create({

      engine,
      message:error.message,
      stack:error.stack,
      severity:"error"

    });

    console.error("🚨 AI Error Logged:",engine,error.message);

  }
  catch(e){

    console.error("AI error logger failed:",e.message);

  }

}