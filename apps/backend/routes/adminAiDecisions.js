import express from "express";
import mongoose from "mongoose";
import AiDecision from "../models/AiDecision.js";
import Product from "../models/Product.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

import { executeDecision } from "../services/aiExecutionEngine.js";
import supplierDiscoveryEngine from "../services/supplierDiscoveryEngine.js";

const router = express.Router();

/* ======================================
   GET AI DECISIONS
====================================== */
router.get(
"/ai-decisions",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const status = req.query.status || "pending";

const decisions = await AiDecision
.find({ status })
.sort({ createdAt:-1 })
.limit(100)
.lean();

res.json({
success:true,
count:decisions.length,
decisions
});

}
catch(err){

console.error("Fetch decisions error:",err);

res.status(500).json({
success:false,
error:"Failed to load decisions"
});

}

});

/* ======================================
   APPROVE AI DECISION (UPGRADED)
====================================== */
router.post(
"/ai-decisions/:id/approve",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const decision = await AiDecision.findById(req.params.id);

if(!decision){
return res.status(404).json({
success:false,
error:"Decision not found"
});
}

if(decision.status !== "pending"){
return res.status(400).json({
success:false,
error:"Decision already processed"
});
}

/* ------------------------------
   MARK APPROVED
------------------------------ */

decision.status = "approved";

if(req.user?.uid && mongoose.Types.ObjectId.isValid(req.user.uid)){
decision.approvedBy = req.user.uid;
}

decision.approvedAt = new Date();

await decision.save();

/* ------------------------------
   EXECUTE DECISION (EXISTING)
------------------------------ */

let executionStatus = "executed";

try{
await executeDecision(decision._id);
}
catch(execError){
console.error("Execution failed:",execError.message);
executionStatus = "execution_failed";
}

/* ====================================
   🚀 AUTO PRODUCT LAUNCH (NEW)
==================================== */

let product = null;

try{

const productName =
decision?.suggestion?.productName ||
decision?.suggestion?.name;

if(productName){

console.log("🚀 Launching product:",productName);

/* GET SUPPLIERS */
const result =
await supplierDiscoveryEngine.findSuppliers(productName);

const best = result?.suppliers?.[0];

if(best){

product = await Product.create({

name: productName,

price:
best.sellingPrice ||
best.price * 2,

supplier: best.supplier,

stock: 100,
isActive: true,

aiGenerated: true,

aiMeta:{
supplier: best,
decisionId: decision._id
}

});

console.log("✅ Product created:",product.name);

}

}

}
catch(err){
console.error("Product launch failed:",err.message);
}

/* ====================================
   RESPONSE
==================================== */

res.json({
success:true,
message:"Decision approved",
decisionId:decision._id,
executionStatus,
product
});

}
catch(err){

console.error("Approve error:",err);

res.status(500).json({
success:false,
error:"Approval failed"
});

}

});

/* ======================================
   REJECT AI DECISION
====================================== */
router.post(
"/ai-decisions/:id/reject",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const decision = await AiDecision.findById(req.params.id);

if(!decision){
return res.status(404).json({
success:false,
error:"Decision not found"
});
}

if(decision.status !== "pending"){
return res.status(400).json({
success:false,
error:"Decision already processed"
});
}

decision.status = "rejected";
decision.rejectedAt = new Date();

await decision.save();

res.json({
success:true,
message:"Decision rejected",
decisionId:decision._id
});

}
catch(err){

console.error("Reject error:",err);

res.status(500).json({
success:false,
error:"Reject failed"
});

}

});

export default router;