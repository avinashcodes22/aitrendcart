// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supplierRoutes from "./routes/suppliers.js"; // 👈 routes import

// ✅ Load environment variables
dotenv.config();

// ✅ Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Mount routes
app.use("/api/suppliers", supplierRoutes);

// 🟢 Debug log to confirm successful route registration
console.log("✅ Supplier routes registered at /api/suppliers");

// ✅ Health check endpoint (optional)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
