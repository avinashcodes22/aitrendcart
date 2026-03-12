import mongoose from "mongoose";

const SupplierOrderSchema = new mongoose.Schema(
  {
    productId: mongoose.Schema.Types.ObjectId,
    productName: String,
    supplier: String,
    quantity: Number,
    estimatedCost: Number,
    status: {
      type: String,
      default: "generated",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "SupplierOrder",
  SupplierOrderSchema
);