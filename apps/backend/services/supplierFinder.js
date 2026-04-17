import SupplierProduct from "../models/SupplierProduct.js";
import SupplierCache from "../models/SupplierCache.js";
import { scrapeSuppliers } from "./supplierScraper.js";

/* ====================================
CONFIG
==================================== */

const CACHE_DURATION = 1000 * 60 * 60 * 6; // 6 hours

const suppliersSeed = [
  { supplier: "Alibaba", source: "alibaba", basePrice: 12 },
  { supplier: "CJ Dropshipping", source: "cjdropshipping", basePrice: 14 },
  { supplier: "Meesho", source: "meesho", basePrice: 10 }
];

/* ====================================
FIND SUPPLIERS (PRODUCTION)
==================================== */

export async function findSuppliers(productName) {

  console.log("🔎 Supplier Finder:", productName);

  /* ===============================
     1. CHECK CACHE
  =============================== */

  try {

    const cached = await SupplierCache.findOne({ productName });

    if (cached) {

      const age =
        Date.now() - new Date(cached.updatedAt).getTime();

      if (age < CACHE_DURATION) {

        console.log("⚡ Using cached suppliers");

        return cached.suppliers;

      }

    }

  } catch (err) {
    console.log("⚠ Cache check failed");
  }

  /* ===============================
     2. TRY REAL SCRAPER
  =============================== */

  let suppliers = [];

  try {

    suppliers = await scrapeSuppliers(productName);

    console.log("🌐 Scraper result:", suppliers.length);

  } catch (err) {

    console.log("⚠ Scraper failed:", err.message);

  }

  /* ===============================
     3. FALLBACK (YOUR OLD LOGIC)
  =============================== */

  if (!suppliers || suppliers.length === 0) {

    console.log("⚠ Using fallback suppliers");

    for (const s of suppliersSeed) {

      try {

        const price =
          s.basePrice + Math.floor(Math.random() * 5);

        const rating =
          Number((Math.random() * 1 + 4).toFixed(1));

        const shippingDays =
          Math.floor(Math.random() * 7) + 5;

        const item =
          await SupplierProduct.findOneAndUpdate(
            {
              productName,
              supplier: s.supplier
            },
            {
              productName,
              supplier: s.supplier,
              source: s.source,
              price,
              moq: 50,
              rating,
              shippingDays
            },
            {
              new: true,
              upsert: true
            }
          );

        suppliers.push(item);

      } catch (err) {

        console.error("Fallback error:", err.message);

      }

    }

  } else {

    /* ===============================
       4. SAVE SCRAPED DATA TO DB
    =============================== */

    for (const s of suppliers) {

      try {

        await SupplierProduct.findOneAndUpdate(
          {
            productName,
            supplier: s.supplier
          },
          {
            productName,
            supplier: s.supplier,
            source: "scraper",
            price: s.price,
            moq: s.moq || 10,
            rating: s.rating,
            shippingDays: s.shippingDays
          },
          {
            upsert: true
          }
        );

      } catch (err) {
        console.log("DB save failed:", err.message);
      }

    }

  }

  /* ===============================
     5. SAVE CACHE
  =============================== */

  try {

    await SupplierCache.findOneAndUpdate(
      { productName },
      {
        productName,
        suppliers,
        updatedAt: new Date()
      },
      { upsert: true }
    );

  } catch (err) {
    console.log("⚠ Cache save failed");
  }

  console.log("📦 Suppliers returned:", suppliers.length);

  return suppliers;

}