import mongoose from "mongoose";

const supplierProductSchema = new mongoose.Schema({

  productName: String,

  supplier: String,

  price: Number,

  moq: Number,

  rating: Number,

  shippingDays: Number,

  source: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model(
  "SupplierProduct",
  supplierProductSchema
);