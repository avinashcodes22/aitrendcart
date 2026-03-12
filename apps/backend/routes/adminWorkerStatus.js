import express from "express";
import IORedis from "ioredis";
import { verifyToken } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";

const router = express.Router();

const connection = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

router.get(
"/worker-status",
verifyToken,
requireRole("admin"),
async(req,res)=>{

try{

const data = await connection.get("ai_worker_status");

if(!data){
return res.json({
status:"offline"
});
}

const worker = JSON.parse(data);

const lastSeen =
Date.now() - worker.lastHeartbeat;

res.json({
status:lastSeen < 15000 ? "online" : "offline",
processedJobs:worker.processedJobs,
lastHeartbeat:worker.lastHeartbeat
});

}
catch(err){

res.status(500).json({
error:"Worker status failed"
});

}

});

export default router;