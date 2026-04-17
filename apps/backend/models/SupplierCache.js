import mongoose from "mongoose";

const SupplierCacheSchema = new mongoose.Schema({

  productName: {
    type: String,
    index: true
  },

  suppliers: [
    {
      supplier: String,
      price: Number,
      rating: Number,
      shippingDays: Number,
      moq: Number,
      profit: Number,
      score: Number
    }
  ],

  source: {
    type: String,
    default: "scraper"
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("SupplierCache", SupplierCacheSchema);