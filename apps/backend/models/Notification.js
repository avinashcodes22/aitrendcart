import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    type: {
      type: String,
      enum: ["order", "ai", "supplier", "security"],
      default: "order",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    meta: Object,
  },
  { timestamps: true }
);

export default mongoose.model(
  "Notification",
  NotificationSchema
);