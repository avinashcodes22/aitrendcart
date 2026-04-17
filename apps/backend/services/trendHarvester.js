import TrendProduct from "../models/TrendProduct.js";
import AiDecision from "../models/AiDecision.js";
import { validateDecisionRisk } from "./aiDecisionRiskGuard.js";

/* ====================================
SIMULATED TREND SOURCES
==================================== */

const sampleTrends = [

{
name:"LED Sneakers",
source:"tiktok",
keywords:["led shoes","glow shoes"]
},

{
name:"Anime Hoodies",
source:"pinterest",
keywords:["anime hoodie","streetwear anime"]
},

{
name:"RGB Gaming Desk",
source:"google",
keywords:["rgb desk setup","gaming desk"]
}

];

/* ====================================
TREND HARVESTER ENGINE
==================================== */

export async function harvestTrends(){

console.log("🌐 Harvesting trends...");

let created = 0;

for(const t of sampleTrends){

try{

const exists = await TrendProduct.findOne({
name:t.name
});

if(exists){
console.log("⚠ Trend already exists:",t.name);
continue;
}

/* ===============================
GENERATE SCORE
=============================== */

const score =
Math.floor(Math.random()*40)+60;

/* ===============================
STORE TREND
=============================== */

const trend = await TrendProduct.create({

name:t.name,
source:t.source,
keywords:t.keywords,
score

});

console.log("📈 Trend stored:",trend.name);

/* ===============================
PREPARE DECISION
=============================== */

const draftDecision = {

type:"TREND_PRODUCT",

entity:"trend",

entityId:trend._id.toString(),

suggestion:{
productName:trend.name,
source:trend.source,
keywords:trend.keywords,
score
},

reason:`Trending product detected from ${trend.source}`

};

/* ===============================
RISK GUARD
=============================== */

const risk =
await validateDecisionRisk(draftDecision);

if(!risk.valid){

console.log(
"⚠ Trend decision blocked:",
risk.reason
);

continue;

}

/* ===============================
PREVENT DUPLICATES
=============================== */

await AiDecision.findOneAndUpdate(

{
type:"TREND_PRODUCT",
entityId:trend._id.toString(),
status:"pending"
},

draftDecision,

{
new:true,
upsert:true
}

);

console.log("🤖 AI decision created:",trend.name);

created++;

}
catch(err){

console.error(
"Trend processing error:",
t.name,
err.message
);

}

}

console.log(
`✅ Trend harvesting finished. ${created} new trends found.`
);

return {
trendsCreated:created
};

}