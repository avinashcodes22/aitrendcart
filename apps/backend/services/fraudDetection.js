import Order from "../models/Order.js";
import AiDecision from "../models/AiDecision.js";

/* 🔥 NEW (ADD SETTINGS CONTROL) */
import SystemSettings from "../models/SystemSettings.js";

/* ====================================
   FRAUD DETECTION ENGINE
==================================== */

export async function runFraudDetection(){

  console.log("🛡 Running Fraud Detection...");

  try {

    /* ===============================
       🔥 LOAD SYSTEM SETTINGS
    =============================== */

    const settings = await SystemSettings.findOne();

    /* 🚫 OPTIONAL: STOP IF AI DISABLED */
    if (!settings?.aiEnabled) {
      console.log("🚫 Fraud Detection Skipped (AI Disabled)");
      return;
    }

    /* ===============================
       FETCH RECENT ORDERS
    =============================== */

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100);

    const userOrderCount = {};

    for (const order of orders) {

      const user = order.userId?.toString();

      if (!user) continue;

      userOrderCount[user] =
        (userOrderCount[user] || 0) + 1;

    }

    /* ===============================
       ANALYZE USERS
    =============================== */

    for (const [userId, count] of Object.entries(userOrderCount)) {

      /* 🔐 SECURITY MODE LOGIC */
      let threshold = 5;

      if (settings?.securityMode === "high") {
        threshold = 3; // stricter
      }

      if (settings?.securityMode === "low") {
        threshold = 7; // relaxed
      }

      /* -------------------------------
         SUSPICIOUS ORDER VOLUME
      ------------------------------- */

      if (count >= threshold) {

        await AiDecision.create({

          type: "FRAUD_ALERT",

          entity: "USER",

          entityId: userId,

          suggestion: {
            user: userId,
            orderCount: count
          },

          reason: `Suspicious activity detected (${count} orders recently)`

        });

        console.log("⚠ Suspicious user:", userId);

      }

    }

    console.log("✅ Fraud detection finished");

  } catch (err) {

    console.error("❌ Fraud detection error:", err);

  }

}