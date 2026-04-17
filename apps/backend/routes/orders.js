import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AdminNotification from "../models/AdminNotification.js";

import { verifyToken } from "../middlewares/auth.js";
import { logAudit } from "../services/auditService.js";
import { trackOrder } from "../services/securityMonitor.js";

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {

  try {

    const { address } = req.body;

    if (!address || !address.fullName || !address.phone || !address.addressLine1) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const cart = await Cart.findOne({ userId: req.user.uid });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart empty" });
    }

    let total = 0;
    const verifiedItems = [];

    for (const item of cart.items) {

      const product = await Product.findById(item.productId);
      if (!product) continue;

      const lineTotal = product.price * item.quantity;
      total += lineTotal;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        supplier: product.supplier || "AI Supplier"
      });

    }

    const order = await Order.create({
      userId: req.user.uid,
      items: verifiedItems,
      amount: total,
      status: "created",
      paymentStatus: "pending",
      address
    });

    /* ===============================
       🔥 NEW: PROFIT TRACKING
    =============================== */

    for (const item of order.items) {

      const product = await Product.findById(item.productId);
      if (!product) continue;

      const revenue = item.price * item.quantity;

      const cost =
        product?.aiMeta?.supplier?.price || 0;

      const profit =
        (item.price - cost) * item.quantity;

      product.revenue += revenue;
      product.profit += profit;
      product.unitsSold += item.quantity;

      await product.save();

    }

    await Cart.findOneAndDelete({ userId: req.user.uid });

    const io = req.app.get("io");
    if (io) trackOrder(io, order);

    const notification = await AdminNotification.create({
      message: `🛒 New order ₹${total} created`,
      type: "order"
    });

    if (io) {
      io.emit("admin_notification", {
        _id: notification._id,
        message: notification.message,
        type: notification.type,
        createdAt: notification.createdAt
      });
    }

    await logAudit({
      userId: req.user.uid,
      action: "ORDER_CREATED",
      entity: "ORDER",
      entityId: order._id,
      details: { amount: total, items: verifiedItems.length },
      req
    });

    res.json({
      ok: true,
      orderId: order._id,
      amount: total
    });

  } catch (err) {

    console.error("Order create error:", err);

    res.status(500).json({ error: "Order failed" });

  }

});

export default router;