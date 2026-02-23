// apps/backend/config/firebase.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to firebase-admin.json (same folder as this file)
const serviceAccountPath = path.join(__dirname, "firebase-admin.json");

// Optional debug: uncomment to verify
// console.log("Using Firebase service account at:", serviceAccountPath);
// console.log("Exists?", fs.existsSync(serviceAccountPath));

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
