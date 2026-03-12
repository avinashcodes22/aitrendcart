import AdminAuditLog from "../models/AdminAuditLog.js";

/* ======================================================
   ADMIN AUDIT LOG SERVICE
====================================================== */

export async function logAdminAction({
  adminId,
  action,
  targetType,
  targetId = null,
  details = {},
  req = null,
}) {
  try {
    const ip =
      req?.headers["x-forwarded-for"] ||
      req?.socket?.remoteAddress ||
      "";

    const userAgent = req?.headers["user-agent"] || "";

    await AdminAuditLog.create({
      adminId,
      action,
      targetType,
      targetId,
      details,
      ipAddress: ip,
      userAgent,
    });

  } catch (err) {
    console.error("Audit log error:", err);
  }
}