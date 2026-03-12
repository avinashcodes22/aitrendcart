import AdminNotification from "../models/AdminNotification.js";

export async function sendAdminNotification(io, msg, type="info") {
  const n = await AdminNotification.create({
    message: msg,
    type,
  });

  io.emit("admin_notification", n);
}