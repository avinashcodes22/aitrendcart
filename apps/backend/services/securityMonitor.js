/* ===============================
ORDER SECURITY MONITOR
================================ */

export function trackOrder(order) {

try {

console.log(
  "📦 Order tracked:",
  order?._id || "unknown"
);

} catch (err) {

console.error(
  "Order tracking error:",
  err.message
);

}

}

/* ===============================
AI FAILURE MONITOR
================================ */

export function trackAIFailure(io, job) {

try {

console.error(
  "🚨 AI Job Failure:",
  job?.id,
  job?.data
);

if (!io) return;

io.emit("ai-job-failure", {
  jobId: job?.id,
  productId: job?.data?.productId,
  timestamp: new Date()
});

} catch (err) {

console.error(
  "Security monitor error:",
  err.message
);

}

}
