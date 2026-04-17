import express from "express";
import AiDecision from "../models/AiDecision.js";

import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

router.get(
"/ai-analytics",
verifyToken,
requireRole("admin"),
async (req,res)=>{

try{

const total = await AiDecision.countDocuments();

const approved = await AiDecision.countDocuments({
status:"approved"
});

const rejected = await AiDecision.countDocuments({
status:"rejected"
});

const executed = await AiDecision.countDocuments({
executed:true
});

res.json({
total,
approved,
rejected,
executed
});

}
catch(err){

res.status(500).json({
error:"AI analytics failed"
});

}

});

export default router;