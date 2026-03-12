import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: null
    },

    action: {
      type: String,
      required: true
    },

    entity: {
      type: String
    },

    entityId: {
      type: String
    },

    details: {
      type: Object
    },

    ip: {
      type: String
    },

    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("AuditLog", auditSchema);