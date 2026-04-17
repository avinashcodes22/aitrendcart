import mongoose from "mongoose";

const aiPerformanceSchema = new mongoose.Schema(
  {
    engine: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "success",
    },

    executionTime: {
      type: Number,
    },

    error: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "aiperformances", // 🔥 FORCE EXACT COLLECTION
  }
);

// 🔥 Prevent model overwrite in dev (IMPORTANT)
export default mongoose.models.AiPerformance ||
  mongoose.model("AiPerformance", aiPerformanceSchema);