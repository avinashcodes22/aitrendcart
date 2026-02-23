// models/LicenseReport.js
import mongoose from "mongoose";

const LicenseReportSchema = new mongoose.Schema(
  {
    productId: { type: String, required: false },
    imageUrl: { type: String, required: true },
    flagged: { type: Boolean, default: false },
    confidence: { type: Number, default: 0 },
    sources: { type: [String], default: [] },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.LicenseReport ||
  mongoose.model("LicenseReport", LicenseReportSchema);
