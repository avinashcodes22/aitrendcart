import mongoose from "mongoose";

const trendProductSchema = new mongoose.Schema({

  name: String,

  source: String,

  score: Number,

  keywords: [String],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model(
  "TrendProduct",
  trendProductSchema
);