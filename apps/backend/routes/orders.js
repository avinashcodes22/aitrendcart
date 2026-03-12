import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import AdminNotification from "../models/AdminNotification.js";

import { verifyToken } from "../middlewares/auth.js";
import { logAudit } from "../services/auditService.js";
import { trackOrder } from "../services/securityMonitor.js";

const router = express.Router();

/* =====================================================
   CREATE ORDER
===================================================== */

router.post("/", verifyToken, async (req, res) => {

  try {

    const { address } = req.body;

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.addressLine1
    ) {
      return res.status(400).json({
        error: "Invalid address"
      });
    }

    /* ===============================
       LOAD CART
    =============================== */

    const cart = await Cart.findOne({
      userId: req.user.uid
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        error: "Cart empty"
      });
    }

    /* ===============================
       VERIFY PRODUCTS
    =============================== */

    let total = 0;
    const verifiedItems = [];

    for (const item of cart.items) {

      const product = await Product.findById(
        item.productId
      );

      if (!product) continue;

      const lineTotal =
        product.price * item.quantity;

      total += lineTotal;

      verifiedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });

    }

    if (verifiedItems.length === 0) {
      return res.status(400).json({
        error: "No valid products"
      });
    }

    /* ===============================
       CREATE ORDER
    =============================== */

    const order = await Order.create({
      userId: req.user.uid,
      items: verifiedItems,
      amount: total,
      status: "created",
      paymentStatus: "pending",
      address
    });

    /* ===============================
       CLEAR CART
    =============================== */

    await Cart.findOneAndDelete({
      userId: req.user.uid
    });

    const io = req.app.get("io");

    /* ===============================
       SECURITY MONITOR
    =============================== */

    if (io) {
      trackOrder(io, order);
    }

    /* ===============================
       ADMIN NOTIFICATION
    =============================== */

    const notification =
      await AdminNotification.create({
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

    /* ===============================
       AUDIT LOG
    =============================== */

    await logAudit({
      userId: req.user.uid,
      action: "ORDER_CREATED",
      entity: "ORDER",
      entityId: order._id,
      details: {
        amount: total,
        items: verifiedItems.length
      },
      req
    });

    res.json({
      ok: true,
      orderId: order._id,
      amount: total
    });

  }

  catch (err) {

    console.error("Order create error:", err);

    res.status(500).json({
      error: "Order failed"
    });

  }

});

/* =====================================================
   GET USER ORDERS
===================================================== */

router.get("/my", verifyToken, async (req, res) => {

  try {

    const orders = await Order.find({
      userId: req.user.uid
    }).sort({ createdAt: -1 });

    res.json(orders);

  }

  catch {

    res.status(500).json({
      error: "Failed to fetch orders"
    });

  }

});

export default router;