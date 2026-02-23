import admin from "../config/firebase.js";
import User from "../models/User.js";

export async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = header.split("Bearer ")[1];

    // Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(token);

    // Look up user in our DB for role
    const dbUser = await User.findOne({ uid: decoded.uid }).lean();

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: dbUser?.role || "user",
    };

    return next();
  } catch (err) {
    console.error("verifyToken error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
