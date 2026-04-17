import axios from "axios";
import Product from "../models/Product.js";
import LicenseReport from "../models/LicenseReport.js";

const SERVICE_URL =
  process.env.LICENSE_SERVICE_URL || "http://localhost:8082";

/* ====================================
   MAIN LICENSE CHECK ENGINE
==================================== */

export async function runLicenseCheck(product) {

  try {

    const imageUrl = product.images?.[0];

    if (!imageUrl) {
      console.log("⚠ No image for license check");
      return;
    }

    let result;

    /* ===============================
       TRY EXTERNAL AI SERVICE
    =============================== */

    try {

      const response = await axios.post(
        `${SERVICE_URL}/verify`,
        {
          productId: product._id,
          imageUrl
        },
        { timeout: 8000 }
      );

      result = response.data;

    } catch (err) {

      console.log("⚠ External AI failed → using fallback");

      result = fallbackDetection(product);

    }

    /* ===============================
       SAVE REPORT
    =============================== */

    const report = await LicenseReport.create({
      productId: product._id,
      imageUrl,
      flagged: result.flagged,
      confidence: result.confidence,
      sources: result.sources || [],
      reason: result.reason
    });

    /* ===============================
       UPDATE PRODUCT
    =============================== */

    await Product.findByIdAndUpdate(product._id, {
      licenseStatus: result.flagged ? "flagged" : "verified",
      licenseReportId: report._id
    });

    console.log(
      `🔐 License checked: ${product.name} → ${result.flagged ? "FLAGGED" : "SAFE"}`
    );

  } catch (err) {

    console.error("License engine error:", err.message);

  }

}

/* ====================================
   FALLBACK AI (LOCAL)
==================================== */

function fallbackDetection(product) {

  const name = product.name?.toLowerCase() || "";

  let flagged = false;
  let reason = "No issues";

  /* 🔥 simple AI rules (expand later) */

  if (
    name.includes("nike") ||
    name.includes("adidas") ||
    name.includes("gucci")
  ) {
    flagged = true;
    reason = "Trademark keyword detected";
  }

  if (product.price < 50) {
    flagged = true;
    reason = "Suspicious low price";
  }

  return {
    flagged,
    confidence: flagged ? 0.85 : 0.6,
    sources: ["local-ai"],
    reason
  };

}