import Order from "../models/Order.js";

/* =====================================================
   AI CUSTOMER ANALYTICS ENGINE
===================================================== */

export async function analyzeCustomers() {

  const orders = await Order.find().lean();

  const customerMap = {};

  for (const order of orders) {

    const uid = String(order.userId);

    if (!customerMap[uid]) {
      customerMap[uid] = {
        userId: uid,
        orders: 0,
        totalSpent: 0,
        lastPurchase: null
      };
    }

    customerMap[uid].orders += 1;
    customerMap[uid].totalSpent += order.amount || 0;

    const orderDate = new Date(order.createdAt);

    if (
      !customerMap[uid].lastPurchase ||
      orderDate > customerMap[uid].lastPurchase
    ) {
      customerMap[uid].lastPurchase = orderDate;
    }
  }

  const result = [];

  const now = new Date();

  for (const uid in customerMap) {

    const c = customerMap[uid];

    const daysSincePurchase =
      (now - new Date(c.lastPurchase)) / (1000 * 60 * 60 * 24);

    let status = "active";

    if (c.orders >= 5) status = "loyal";
    if (daysSincePurchase > 60) status = "inactive";

    result.push({
      userId: c.userId,
      orders: c.orders,
      lifetimeValue: c.totalSpent,
      lastPurchase: c.lastPurchase,
      status
    });
  }

  return result;
}