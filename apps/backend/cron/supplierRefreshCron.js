import cron from "node-cron";
import Product from "../models/Product.js";
import { findSuppliers } from "../services/supplierFinder.js";

/* ======================================================
   SUPPLIER AUTO REFRESH CRON
====================================================== */

export function startSupplierRefreshCron() {

  console.log("⏰ Supplier Refresh Cron Started");

  cron.schedule("0 */6 * * *", async () => {

    console.log("🔄 Running Supplier Refresh Job...");

    try {

      const products = await Product.find().limit(50);

      console.log("📦 Products:", products.length);

      for (const product of products) {

        try {

          console.log("🔁 Updating:", product.name);

          await findSuppliers(product.name);

        } catch (err) {

          console.log("❌ Failed:", product.name, err.message);

        }

      }

      console.log("✅ Supplier Refresh Completed");

    } catch (err) {

      console.error("❌ Cron Error:", err);

    }

  });

}