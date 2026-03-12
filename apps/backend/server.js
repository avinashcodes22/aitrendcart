import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";

/* ===============================
   LOAD ENV
================================ */
dotenv.config();

/* ===============================
   EXPRESS APP
================================ */
const app = express();

/* ===============================
   SECURITY HEADERS
================================ */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

/* ===============================
   CORS
================================ */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

/* ===============================
   BODY PARSER
================================ */
app.use(express.json());

/* ===============================
   DATABASE
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB error:", err.message)
  );

/* ===============================
   SOCKET.IO
================================ */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

app.set("io", io);
global.io = io;

io.on("connection", () => {
  console.log("🔔 Admin connected");
});

/* ===============================
   SCHEDULERS
================================ */
import "./services/backupScheduler.js";
import "./services/trendScheduler.js";
import { startAIScheduler } from "./services/aiScheduler.js";

/* ===============================
   IMPORT ROUTES
================================ */

import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/orders.js";
import checkoutRoutes from "./routes/checkout.js";
import paymentsRoutes from "./routes/payments.js";
import visualSearch from "./routes/visualSearch.js";
import recommend from "./routes/recommend.js";
import supplierRoutes from "./routes/suppliers.js";
import aiRoutes from "./routes/ai.js";
import tryonRoutes from "./routes/tryon.js";
import licenseRoutes from "./routes/license.js";

/* Admin */

import adminDiscovery from "./routes/adminDiscovery.js";
import adminWorkerStatus from "./routes/adminWorkerStatus.js";
import adminBackup from "./routes/adminBackup.js";
import adminAIOperations from "./routes/adminAIOperations.js";
import adminTrendsHarvest from "./routes/adminTrendsHarvest.js";
import adminProducts from "./routes/adminProducts.js";
import adminStats from "./routes/adminStats.js";
import adminTrends from "./routes/adminTrends.js";
import adminPredictions from "./routes/adminPredictions.js";
import adminNotifications from "./routes/adminNotifications.js";
import adminSuppliersGraph from "./routes/adminSuppliersGraph.js";
import adminAiRoutes from "./routes/adminAi.js";
import adminRestockExecute from "./routes/adminRestockExecute.js";
import adminPricingExecute from "./routes/adminPricingExecute.js";
import adminInventory from "./routes/adminInventory.js";
import adminPricing from "./routes/adminPricing.js";
import adminRestock from "./routes/adminRestock.js";
import adminDiscoveryImport from "./routes/adminDiscoveryImport.js";
import adminAiInsights from "./routes/adminAiInsights.js";
import adminAuditLogs from "./routes/adminAuditLogs.js";
import adminSupplierFinder from "./routes/adminSupplierFinder.js";
import adminPricingAI from "./routes/adminPricingAI.js";
import adminAdsAI from "./routes/adminAdsAI.js";
import adminEmailAI from "./routes/adminEmailAI.js";
import adminCustomerAnalytics from "./routes/adminCustomerAnalytics.js";
import adminAiActions from "./routes/adminAiActions.js";
import adminWorkerControl from "./routes/adminWorkerControl.js";
import adminAiDecisions from "./routes/adminAiDecisions.js";
import adminRevenueInsights from "./routes/adminRevenueInsights.js";
import adminSupplierAI from "./routes/adminSupplierAI.js";
import adminMarketingAI from "./routes/adminMarketingAI.js";
import adminGrowthAI from "./routes/adminGrowthAI.js";
import adminCustomerAI from "./routes/adminCustomerAI.js";
import adminStoreManager from "./routes/adminStoreManager.js";
import adminTrendScanner from "./routes/adminTrendScanner.js";
import adminViralPredictor from "./routes/adminViralPredictor.js";
import adminCompetitorIntel from "./routes/adminCompetitorIntel.js";
import adminDemandForecast from "./routes/adminDemandForecast.js";
import adminCustomerBehavior from "./routes/adminCustomerBehavior.js";
import adminGrowthStrategy from "./routes/adminGrowthStrategy.js";
import adminAIHealth from "./routes/adminAIHealth.js";
import adminGlobalExpansion from "./routes/adminGlobalExpansion.js";
import adminPricingOptimizer from "./routes/adminPricingOptimizer.js";
import adminProductBundling from "./routes/adminProductBundling.js";
import adminPersonalShoppingAI from "./routes/adminPersonalShoppingAI.js";
import adminAIStrategy from "./routes/adminAIStrategy.js";
import adminInvestorMode from "./routes/adminInvestorMode.js";
/* ===============================
   RATE LIMITERS
================================ */

import {
  publicLimiter,
  adminLimiter,
} from "./middlewares/rateLimit.js";

/* ===============================
   PUBLIC ROUTES
================================ */

app.use("/api/products", publicLimiter, productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminAIOperations);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/visual-search", visualSearch);
app.use("/api/recommend", recommend);
app.use("/api/tryon", tryonRoutes);

/* ===============================
   ADMIN AI ROUTES
================================ */

app.use("/api/admin", adminGrowthStrategy);
app.use("/api/admin", adminInvestorMode);
app.use("/api/admin", adminAIStrategy);
app.use("/api/admin", adminPersonalShoppingAI);
app.use("/api/admin", adminProductBundling);
app.use("/api/admin", adminPricingOptimizer);
app.use("/api/admin", adminGlobalExpansion);
app.use("/api/admin", adminAIHealth);
app.use("/api/admin", adminDiscoveryImport);
app.use("/api/admin", adminCompetitorIntel);
app.use("/api/admin", adminCustomerBehavior);
app.use("/api/admin", adminDemandForecast);
app.use("/api/admin", adminStoreManager);
app.use("/api/admin", adminViralPredictor);
app.use("/api/admin", adminGrowthAI);
app.use("/api/admin", adminTrendScanner);
app.use("/api/admin", adminMarketingAI);
app.use("/api/admin", adminSupplierAI);
app.use("/api/admin", adminCustomerAI);
app.use("/api/admin", adminAiDecisions);
app.use("/api/admin", adminRevenueInsights);
app.use("/api/admin", adminWorkerControl);
app.use("/api/admin", adminAiActions);
app.use("/api/admin", adminCustomerAnalytics);
app.use("/api/admin", adminEmailAI);
app.use("/api/admin", adminAdsAI);
app.use("/api/admin", adminRestockExecute);
app.use("/api/admin", adminPricingExecute);
app.use("/api/admin", adminInventory);
app.use("/api/admin", adminPricing);
app.use("/api/admin", adminRestock);
app.use("/api/admin", adminDiscovery);
app.use("/api/admin", adminAiInsights);
app.use("/api/admin", adminAuditLogs);
app.use("/api/admin", adminWorkerStatus);
app.use("/api/admin", adminBackup);
app.use("/api/admin", adminTrendsHarvest);
app.use("/api/admin", adminSupplierFinder);
app.use("/api/admin", adminPricingAI);

/* ===============================
   ADMIN CORE ROUTES
================================ */

app.use("/api/admin/products", adminProducts);
app.use("/api/admin/stats", adminLimiter, adminStats);
app.use("/api/admin/trends", adminLimiter, adminTrends);
app.use("/api/admin/predictions", adminLimiter, adminPredictions);
app.use("/api/admin/notifications", adminLimiter, adminNotifications);
app.use("/api/admin/suppliers-graph", adminLimiter, adminSuppliersGraph);
app.use("/api/admin/ai", adminLimiter, adminAiRoutes);

/* ===============================
   SUPPLIER + AI
================================ */

app.use("/api/suppliers", adminLimiter, supplierRoutes);
app.use("/api/ai", adminLimiter, aiRoutes);
app.use("/api/license", adminLimiter, licenseRoutes);

/* ===============================
   STATIC FILES
================================ */

app.use("/uploads", express.static("uploads"));

/* ===============================
   HEALTH CHECK
================================ */

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    db: mongoose.connection.readyState,
    uptime: process.uptime(),
  });
});

/* ===============================
   TEST ALERTS
================================ */

app.get("/test-alert", (req, res) => {

  const io = app.get("io");

  io.emit("security_alert", {
    type: "ORDER_SPIKE",
    message: "🚨 Test security alert",
    createdAt: new Date()
  });

  res.send("Alert sent");

});

app.get("/test-notify", (req,res)=>{

  const io = app.get("io");

  io.emit("admin_notification",{
    type:"system",
    message:"🔔 Test notification",
    createdAt:new Date()
  });

  res.send("Notification sent");

});

/* ===============================
   START SERVER
================================ */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`🚀 Backend running on http://localhost:${PORT}`);

  /* START AI AUTOMATION */

  startAIScheduler();

});