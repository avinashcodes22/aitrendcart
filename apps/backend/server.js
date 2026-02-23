import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import checkoutRoutes from "./routes/checkout.js";
import orderRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";
import adminProductsRoutes from "./routes/adminProducts.js";
import visualSearch from "./routes/visualSearch.js";
import recommend from "./routes/recommend.js";
import supplierRoutes from "./routes/suppliers.js";
import cartRoutes from "./routes/cart.js";
import aiRoutes from "./routes/ai.js";
import productRoutes from "./routes/products.js";
import licenseRoutes from "./routes/license.js";
import { publicLimiter, adminLimiter } from "./middlewares/rateLimit.js";
import adminAiRoutes from "./routes/adminAi.js";
import tryonRoutes from "./routes/tryon.js";

dotenv.config();

const app = express();

/* ===============================
   🔐 SECURITY HEADERS
================================ */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use("/api/admin", adminAiRoutes);
/* ===============================
   🌍 CORS (MODERN SAFE CONFIG)
================================ */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/recommend", recommend);

app.use("/api/tryon", tryonRoutes);
app.use("/uploads", express.static("uploads"));

/* ===============================
   🧾 BODY PARSER
================================ */
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/visual-search", visualSearch);
/* ===============================
   🔗 DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (local)"))
  .catch(err => console.error("❌ MongoDB error:", err.message));

/* ===============================
   🚦 ROUTES
================================ */

/* Public */
app.use("/api/products", publicLimiter, productRoutes);

/* Cart (auth inside route) */
app.use("/api/cart", cartRoutes);

/* Admin / AI */
app.use("/api/suppliers", adminLimiter, supplierRoutes);
app.use("/api/ai", adminLimiter, aiRoutes);
app.use("/api/license", adminLimiter, licenseRoutes);
app.use("/api/checkout", checkoutRoutes);
/* payment */
app.use("/api/payments", paymentsRoutes);
/* ===============================
   ❤️ HEALTH
================================ */
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState,
    uptime: process.uptime(),
  });
});

/* ===============================
   🚀 START SERVER
================================ */
const port = process.env.PORT || 5000;
const host = process.env.HOST || "0.0.0.0";

app.listen(port, host, () => {
  console.log(`🚀 Backend running on http://${host}:${port}`);
});
