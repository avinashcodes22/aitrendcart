import mongoose from "mongoose";

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Meesho"
    key: { type: String, required: true },  // e.g. "meesho"
    type: { type: String, enum: ["api", "csv"], default: "api" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    lastSync: { type: Date, default: null },
    productCount: { type: Number, default: 0 },
    credentials: { type: Object, default: {} }
  },
  { timestamps: true }
);

// Prevent overwrite in dev
export default mongoose.models.Supplier ||
  mongoose.model("Supplier", SupplierSchema);
