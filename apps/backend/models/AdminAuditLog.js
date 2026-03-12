import mongoose from "mongoose";

/* ======================================================
   ADMIN AUDIT LOG MODEL
====================================================== */

const AdminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      enum: [
        "product",
        "order",
        "supplier",
        "pricing",
        "inventory",
        "ai",
        "system",
      ],
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    details: {
      type: Object,
      default: {},
    },

    ipAddress: {
      type: String,
      default: "",
    },

    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.AdminAuditLog ||
  mongoose.model("AdminAuditLog", AdminAuditLogSchema);