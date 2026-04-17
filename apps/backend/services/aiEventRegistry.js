import { subscribe } from "./aiEventBus.js";

import { discoverSuppliersForProduct } from "./supplierDiscoveryEngine.js";

/* ======================================================
AI EVENT REGISTRY
Connects AI engines to the event bus
====================================================== */

export function registerAIEvents(){

console.log("🔗 Registering AI events");

/* ====================================
TREND DETECTED
==================================== */

subscribe("trend_detected", async (data)=>{

try{

console.log(
"📡 Event → trend_detected",
data.productName
);

await discoverSuppliersForProduct(
data.productName
);

}
catch(err){

console.error(
"Trend event error:",
err.message
);

}

});

/* ====================================
SUPPLIER FOUND
==================================== */

subscribe("supplier_found", async (data)=>{

console.log(
"📡 Event → supplier_found",
data.productName
);

/* future automation */

});

/* ====================================
INVENTORY LOW
==================================== */

subscribe("inventory_low", async (data)=>{

console.log(
"📡 Event → inventory_low",
data.productName
);

/* future restock automation */

});

}
