import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({

  aiEnabled: {
    type: Boolean,
    default: true
  },

  supplierAuto: {
    type: Boolean,
    default: true
  },

  securityMode: {
    type: String,
    enum: ["low", "normal", "high"],
    default: "normal"
  },

  /* 🔥 NEW */
  aiMode: {
    type: String,
    enum: ["safe", "balanced", "aggressive"],
    default: "balanced"
  }

}, { timestamps: true });

export default mongoose.model("SystemSettings", systemSettingsSchema);