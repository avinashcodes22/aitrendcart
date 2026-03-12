const securityState = {
  ordersLastMinute: [],
  aiFailuresLastMinute: []
};

/* =====================================================
   ORDER MONITOR
===================================================== */

export function trackOrder(io, order) {

  const now = Date.now();

  securityState.ordersLastMinute.push(now);

  /* remove entries older than 60 seconds */

  securityState.ordersLastMinute =
    securityState.ordersLastMinute.filter(
      t => now - t < 60000
    );

  const count = securityState.ordersLastMinute.length;

  /* ALERT if too many orders */

  if (count >= 20) {

    io.emit("security_alert", {
      type: "ORDER_SPIKE",
      message: `🚨 High order activity detected (${count} orders/min)`,
      level: "warning",
      time: new Date()
    });

  }

}

/* =====================================================
   AI FAILURE MONITOR
===================================================== */

export function trackAIFailure(io, job) {

  const now = Date.now();

  securityState.aiFailuresLastMinute.push(now);

  securityState.aiFailuresLastMinute =
    securityState.aiFailuresLastMinute.filter(
      t => now - t < 60000
    );

  const count = securityState.aiFailuresLastMinute.length;

  if (count >= 5) {

    io.emit("security_alert", {
      type: "AI_FAILURE_SPIKE",
      message: `⚠️ Multiple AI job failures (${count}/min)`,
      level: "danger",
      time: new Date()
    });

  }

}