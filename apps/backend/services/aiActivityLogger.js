import AiPerformance from "../models/AiPerformance.js";

export async function logAIActivity(engine, message){

await AiPerformance.create({

engine,
status:"activity",
executionTime:0,
error:message

});

}