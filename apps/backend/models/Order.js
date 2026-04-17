import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,

        // ✅ NEW (non-breaking)
        supplier: { type: String, default: "unknown" }
      }
    ],

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: [
        "created",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "failed",
        "cancelled"
      ],
      default: "created"
    },

    paymentGateway: String,
    paymentMethod: String,
    paymentDetails: {},

    address: {
      fullName: String,
      phone: String,
      addressLine1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);