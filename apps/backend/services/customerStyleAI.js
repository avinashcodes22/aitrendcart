import Order from "../models/Order.js";

export async function stylePrediction(userId) {
  const orders = await Order.find({ userId });

  const styleMap = {};

  for (const o of orders) {
    for (const item of o.items) {
      if (!styleMap[item.name])
        styleMap[item.name] = 0;

      styleMap[item.name] += item.quantity;
    }
  }

  return Object.entries(styleMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);
}