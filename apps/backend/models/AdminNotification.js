import mongoose from "mongoose";

const AdminNotificationSchema = new mongoose.Schema(
  {
    message: String,
    type: String, // order, ai, supplier, payment
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model(
  "AdminNotification",
  AdminNotificationSchema
);