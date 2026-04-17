import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
{
/* ==============================
URL + Supplier Mapping
============================== */

slug: {
type: String,
required: true,
unique: true,
lowercase: true,
index: true
},

supplier: {
type: String,
required: true,
index: true
},

productId: {
type: String,
required: true,
index: true
},

name: {
type: String,
required: true,
text: true
},

/* ==============================
Core Product Info
============================== */

price: {
type: Number,
default: 0,
index: true
},

images: [{
type: String
}],

stock: {
type: Number,
default: 0
},

category: {
type: String,
default: "Misc",
index: true
},

sourceUrl: {
type: String,
default: ""
},

/* ==============================
🔥 NEW — AI BUSINESS METRICS
============================== */

revenue: {
type: Number,
default: 0
},

profit: {
type: Number,
default: 0
},

unitsSold: {
type: Number,
default: 0
},

aiPerformance: {
score: { type: Number, default: 0 },
status: {
type: String,
enum: ["scaling","stable","dropping"],
default: "stable"
},
lastEvaluatedAt: Date
},

/* ==============================
AI / 3D Conversion
============================== */

model3dUrl: {
type: String,
default: ""
},

modelUsdzUrl: {
type: String,
default: ""
},

conversionStatus: {
type: String,
enum: ["none","queued","pending","generated","error"],
default: "none",
index: true
},

conversionMode: {
type: String,
enum: ["preview","hq","none"],
default: "none"
},

aiGeneratedAt: {
type: Date
},

aiWorker: {
type: String,
default: ""
},

/* ==============================
AR Permission Control
============================== */

isARAllowed: {
type: Boolean,
default: false,
index: true
},

isRestricted: {
type: Boolean,
default: false
},

arViews: {
type: Number,
default: 0
},

arPurchases: {
type: Number,
default: 0
},

/* ==============================
License / Copyright Safety
============================== */

licenseStatus: {
type: String,
enum: ["unknown","flagged","verified"],
default: "unknown",
index: true
},

licenseReportId: {
type: mongoose.Schema.Types.ObjectId,
ref: "LicenseReport",
default: null
},

/* ==============================
Analytics
============================== */

views: {
type: Number,
default: 0
},

purchases: {
type: Number,
default: 0
},

arEnabled: {
type: Boolean,
default: true
}

},
{ timestamps: true }
);

/* AUTO SLUG */
ProductSchema.pre("validate", function(next) {
if (!this.slug && this.productId) {
this.slug = this.productId
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-")
.replace(/^-|-$/g,"");
}
next();
});

/* INDEX */
ProductSchema.index(
{ supplier:1, productId:1 },
{ unique:true }
);

export default mongoose.models.Product ||
mongoose.model("Product", ProductSchema);