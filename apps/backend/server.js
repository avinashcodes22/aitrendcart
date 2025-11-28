import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import supplierRoutes from "./routes/suppliers.js";
import aiRoutes from "./routes/ai.js";      // ✅ NEW

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/ai", aiRoutes);               // ✅ NEW

app.get("/api/health", (req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";
app.listen(port, host, () =>
  console.log(`🚀 Backend running on http://${host}:${port}`)
);
