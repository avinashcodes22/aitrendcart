import IORedis from "ioredis";

const redis = new IORedis(
process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

const LOCK_KEY = "aitrendcart:scheduler-lock";
const LOCK_TTL = 60 * 60; // 1 hour

export async function acquireSchedulerLock() {

const result = await redis.set(
LOCK_KEY,
process.pid,
"NX",
"EX",
LOCK_TTL
);

if (result === "OK") {
console.log("🔒 Scheduler lock acquired");
return true;
}

console.log("⚠ Scheduler already running on another instance");
return false;

}
