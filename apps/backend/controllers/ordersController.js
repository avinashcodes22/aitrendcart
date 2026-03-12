import {
  createOrderFromCart,
  getUserOrders
} from "../services/orderService.js";

/* ===============================
   CREATE ORDER
=============================== */
export const createOrder = async (req, res) => {
  try {
    const order = await createOrderFromCart(
      req.user.uid,
      req.body.address
    );

    res.json({
      ok: true,
      orderId: order._id,
      amount: order.amount,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* ===============================
   GET MY ORDERS
=============================== */
export const myOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.uid);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};