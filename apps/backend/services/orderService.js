import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/* ===============================
   CREATE ORDER
=============================== */
export const createOrderFromCart = async (userId, address) => {
  if (
    !address ||
    !address.fullName ||
    !address.phone ||
    !address.addressLine1
  ) {
    throw new Error("Invalid address");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
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
    });
  }

  if (verifiedItems.length === 0) {
    throw new Error("No valid products in cart");
  }

  const order = await Order.create({
    userId,
    items: verifiedItems,
    amount: total,
    status: "created",
    paymentMethod: "online",
    paymentGateway: null,
    address,
  });

  await Cart.findOneAndDelete({ userId });

  return order;
};

/* ===============================
   GET USER ORDERS
=============================== */
export const getUserOrders = async (userId) => {
  return Order.find({ userId }).sort({ createdAt: -1 });
};