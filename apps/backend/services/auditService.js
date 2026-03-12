import AuditLog from "../models/AuditLog.js";

/* =====================================================
   CENTRALIZED AUDIT LOGGER
===================================================== */

export async function logAudit({
  userId = null,
  action,
  entity = null,
  entityId = null,
  details = {},
  req = null
}) {
  try {

    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      details,
      ip: req?.ip || null,
      userAgent: req?.headers?.["user-agent"] || null
    });

  } catch (err) {
    console.error("Audit logging failed:", err.message);
  }
}