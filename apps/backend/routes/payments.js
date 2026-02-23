import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* -------------------------------------------------- */
/* SAFE RAZORPAY INITIALIZATION (OPTIONAL) */
/* -------------------------------------------------- */

let razorpay = null;

if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  console.log("Razorpay initialized");
} else {
  console.log("Razorpay disabled (no keys provided)");
}

/* -------------------------------------------------- */
/* CREATE RAZORPAY ORDER */
/* -------------------------------------------------- */

router.post("/create-razorpay-order", verifyToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res
        .status(503)
        .json({ error: "Razorpay not configured" });
    }

    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Missing orderId" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.amount * 100,
      currency: "INR",
      receipt: order._id.toString()
    });

    order.paymentDetails = {
      razorpayOrderId: razorpayOrder.id
    };

    await order.save();

    res.json({
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: order.amount
    });
  } catch (err) {
    console.error("Razorpay create error:", err.message);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

/* -------------------------------------------------- */
/* VERIFY PAYMENT */
/* -------------------------------------------------- */

router.post("/verify-razorpay", verifyToken, async (req, res) => {
  try {
    if (!razorpay) {
      return res
        .status(503)
        .json({ error: "Razorpay not configured" });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    const order = await Order.findOne({
      "paymentDetails.razorpayOrderId": razorpay_order_id
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = "paid";

    order.paymentDetails = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    };

    await order.save();

    res.json({ ok: true });
  } catch (err) {
    console.error("Verify payment error:", err.message);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

export default router;
