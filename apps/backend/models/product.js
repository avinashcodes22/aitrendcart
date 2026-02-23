import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    /* ──────────────────────────────
       URL + Supplier Mapping
    ────────────────────────────── */

    // SEO friendly URL like /product/meesho-1
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    supplier: { type: String, required: true },

    // Supplier SKU / external ID
    productId: { type: String, required: true },

    name: { type: String, required: true },

    /* ──────────────────────────────
       Core Product Info
    ────────────────────────────── */

    price: { type: Number, default: 0 },

    // Multiple product images
    images: [{ type: String }],

    stock: { type: Number, default: 0 },

    category: { type: String, default: "Misc" },

    sourceUrl: { type: String, default: "" },

    /* ──────────────────────────────
       AI / 3D Conversion
    ────────────────────────────── */

    model3dUrl: { type: String, default: "" }, // GLB URL
    modelUsdzUrl: { type: String, default: "" }, // iOS AR

    conversionStatus: {
      type: String,
      enum: ["none", "pending", "generated", "error"],
      default: "none",
    },

    conversionMode: {
      type: String,
      enum: ["preview", "hq", "none"],
      default: "none",
    },

    /* ──────────────────────────────
       AR Permission Control
    ────────────────────────────── */

    isARAllowed: { type: Boolean, default: false },
    isRestricted: { type: Boolean, default: false },

    arViews: { type: Number, default: 0 },
    arPurchases: { type: Number, default: 0 },

    /* ──────────────────────────────
       License / Copyright Safety
    ────────────────────────────── */

    licenseStatus: {
      type: String,
      enum: ["unknown", "flagged", "verified"],
      default: "unknown",
    },

    licenseReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LicenseReport",
      default: null,
    },

    /* Optional future use */
    arEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

/* ──────────────────────────────
   AUTO-GENERATE SLUG IF MISSING
────────────────────────────── */

ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.productId) {
    this.slug = this.productId
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

/* Prevent model overwrite on hot reload */
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);