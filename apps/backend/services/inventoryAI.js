import Product from "../models/Product.js";

/* ======================================================
   INVENTORY INSIGHTS ENGINE
====================================================== */

export async function inventoryInsights() {

try{

const products = await Product.find().lean();

const alerts = [];
const seen = new Set();

for(const p of products){

if(!p.slug) continue;

/* ===============================
REMOVE DUPLICATES
=============================== */

if(seen.has(p.slug)) continue;
seen.add(p.slug);

const stock = p.stock ?? 0;

/* ===============================
LOW STOCK
=============================== */

if(stock <= 5){

alerts.push({

productId: p._id,
productName: p.name,

status: "LOW_STOCK",
stock,

/* AI SIGNALS */

stockRisk: "high",
suggestedQuantity: 50

});

}

/* ===============================
OVERSTOCK
=============================== */

if(stock > 200){

alerts.push({

productId: p._id,
productName: p.name,

status: "OVERSTOCK",
stock,

/* AI SIGNALS */

stockRisk: "low",
suggestedQuantity: 0

});

}

}

/* ===============================
LIMIT RESULTS
=============================== */

return alerts.slice(0,5);

}
catch(err){

console.error("Inventory AI error:",err);

return [];

}

}