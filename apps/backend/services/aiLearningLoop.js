import AiDecision from "../models/AiDecision.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
 /*
AI LEARNING LOOP
Evaluates results of executed AI decisions
==========================================

*/

export async function evaluateDecisionOutcome(decisionId){

try{

const decision = await AiDecision.findById(decisionId);

if(!decision){
throw new Error("Decision not found");
}

if(!decision.executed){
console.log("⚠ Decision not executed yet");
return;
}

const product = await Product.findById(
decision.entityId
);

if(!product){
console.log("⚠ Product not found for decision");
return;
}

/* ====================================
ONLY ORDERS AFTER DECISION EXECUTION
==================================== */

const orders = await Order.find({

createdAt:{ $gte: decision.executedAt },

"items.productId":product._id

}).lean();

/* ====================================
CALCULATE PRODUCT SALES
==================================== */

let totalSales = 0;
let orderCount = 0;

for(const order of orders){

for(const item of order.items){

if(String(item.productId) === String(product._id)){

orderCount++;

totalSales +=
(item.price || 0) *
(item.quantity || 1);

}

}

}

/* ====================================
SUCCESS SCORE
==================================== */

let successScore = 0;

if(orderCount > 0){

const revenueScore =
Math.min(50,totalSales / 10);

const demandScore =
Math.min(50,orderCount * 5);

successScore =
Math.round(revenueScore + demandScore);

}

/* ====================================
SAVE LEARNING RESULT
==================================== */

decision.performance = {

totalSales,
orderCount,
successScore,
evaluatedAt:new Date()

};

await decision.save();

console.log(
"📊 AI Learning recorded",
successScore
);

}
catch(err){

console.error(
"AI learning error:",
err.message
);

}

}
