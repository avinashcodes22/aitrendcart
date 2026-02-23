import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

/* ================================
   CREATE ORDER (USER)
   POST /api/orders
================================ */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { address } = req.body;

    // 1️⃣ Validate address
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.addressLine1
    ) {
      return res.status(400).json({ error: "Invalid address" });
    }

    // 2️⃣ Load user's cart
    const cart = await Cart.findOne({ userId: req.user.uid });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 3️⃣ Recalculate prices from Product DB (ANTI-TAMPER)
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
      });
    }

    if (verifiedItems.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid products in cart" });
    }

    // 4️⃣ Create order snapshot
    const order = await Order.create({
      userId: req.user.uid,
      items: verifiedItems,
      amount: total,
      status: "created",
      paymentMethod: "online",
      paymentGateway: null,
      address,
    });

    // 5️⃣ Clear cart AFTER order creation
    await Cart.findOneAndDelete({ userId: req.user.uid });

    res.json({
      ok: true,
      orderId: order._id,
      amount: total,
    });
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

/* ================================
   GET MY ORDERS
   GET /api/orders/my
================================ */
router.get("/my", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

/* GET USER ORDERS */
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


export default router;
