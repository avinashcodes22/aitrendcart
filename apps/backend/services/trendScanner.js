import AiDecision from "../models/AiDecision.js";

/* ====================================
   TREND SOURCES (SIMULATED)
==================================== */

const sources = [

{
platform:"tiktok",
products:[
"LED Sneakers",
"Anime Hoodies"
]
},

{
platform:"instagram",
products:[
"Streetwear Oversized Tees",
"Minimalist Watches"
]
},

{
platform:"facebook",
products:[
"Smart LED Lamps",
"Portable Projectors"
]
},

{
platform:"pinterest",
products:[
"Korean Fashion Jackets",
"Aesthetic Desk Setup"
]
},

{
platform:"google",
products:[
"RGB Gaming Chair",
"Magnetic Phone Mount"
]
}

];

/* ====================================
   TREND SCANNER
==================================== */

export async function runTrendScanner(){

console.log("🌐 Running Trend Scanner...");

for(const source of sources){

for(const name of source.products){

const exists = await AiDecision.findOne({
type:"PRODUCT_LAUNCH",
"suggestion.productName":name,
status:"pending"
});

if(exists) continue;

await AiDecision.create({

type:"PRODUCT_LAUNCH",

entity:"PRODUCT",

suggestion:{

productName:name,
source:source.platform,
initialPrice:1999,
supplier:"trend-discovery"

},

reason:`Trending product detected on ${source.platform}`

});

console.log(`📈 Trend detected: ${name} (${source.platform})`);

}

}

console.log("✅ Trend scanning completed");

}