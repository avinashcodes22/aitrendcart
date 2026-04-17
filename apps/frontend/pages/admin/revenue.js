import { useEffect,useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function Revenue(){

const { user } = useAuth(); // ✅ FIXED

const [data,setData] = useState(null);
const [loading,setLoading] = useState(true);

const [runningHarvester,setRunningHarvester] = useState(false);
const [runningSupplierAI,setRunningSupplierAI] = useState(false);

/* ===============================
   HELPER (VERY IMPORTANT)
================================ */

async function callAPI(endpoint, method="POST") {

  if (!user) return;

  try {

    const token = await user.getIdToken();

    const res = await fetch(`${API}${endpoint}`,{
      method,
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    let data = null;

    try {
      data = await res.json();
    } catch {
      alert("Server error");
      return null;
    }

    if (!res.ok) {
      alert(data?.error || "Request failed");
      return null;
    }

    return data;

  } catch (err) {

    console.error(err);
    alert("Server error");
    return null;

  }

}

/* ===============================
   LOAD DATA
================================ */

async function load(){

if (!user) {
  setLoading(false);
  return;
}

try {

const token = await user.getIdToken();

const res = await fetch(
`${API}/api/admin/revenue-insights`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

let d = null;

try {
  d = await res.json();
} catch {
  setData({});
  return;
}

if (!res.ok) {
  console.error(d);
  setData({});
  return;
}

setData(d);

} catch (err) {

console.error("Revenue load error:",err);
setData({});

}

setLoading(false);

}

/* ===============================
   ALL AI ACTIONS (CLEANED)
================================ */

async function runMarketingAI(){
  const data = await callAPI("/api/admin/run-marketing-ai");
  if(data) alert(data.message || "Marketing AI finished");
}

async function runPricingAI(){
  const data = await callAPI("/api/admin/run-pricing-ai");
  if(data) alert(data.message || "Pricing AI finished");
}

async function runGrowthAI(){
  const data = await callAPI("/api/admin/run-growth-ai");
  if(data) alert(data.message || "Growth engine finished");
}

async function runFraudDetection(){
  const data = await callAPI("/api/admin/run-fraud-detection");
  if(data) alert(data.message || "Fraud detection completed");
}

async function runCustomerAI(){
  const data = await callAPI("/api/admin/run-customer-ai");
  if(data) alert(data.message || "Customer intelligence completed");
}

async function runStoreManager(){
  const data = await callAPI("/api/admin/run-store-manager");
  if(data) alert(data.message || "Store manager completed");
}

async function runViralPredictor(){
  const data = await callAPI("/api/admin/run-viral-predictor");
  if(data) alert(`Viral predictions: ${data.predictions}`);
}

async function runTrendHarvester(){

setRunningHarvester(true);

const data = await callAPI("/api/admin/harvest-trends");

if(data) alert(data.message || "Trend harvesting completed");

setRunningHarvester(false);

}

async function scanTrends(){
  const data = await callAPI("/api/admin/scan-trends");
  if(data) alert(data.message || "Trend scan completed");
}

async function runDemandForecast(){
  const data = await callAPI("/api/admin/run-demand-forecast");
  if(data) alert(`Demand alerts: ${data.alerts}`);
}

async function runCompetitorScan(){
  const data = await callAPI("/api/admin/run-competitor-intel");
  if(data) alert(`Competitor alerts: ${data.alerts}`);
}

async function runGrowthStrategy(){
  const data = await callAPI("/api/admin/run-growth-strategy");
  if(data) alert(`Growth strategies: ${data.strategies}`);
}

async function runBehaviorAnalysis(){
  const data = await callAPI("/api/admin/run-behavior-analysis");
  if(data) alert(`Behavior insights: ${data.insights}`);
}

async function runSupplierAI(){

setRunningSupplierAI(true);

const data = await callAPI("/api/admin/analyze-suppliers");

if(data) alert(data.message || "Supplier analysis finished");

setRunningSupplierAI(false);

}

/* =============================== */

useEffect(()=>{
load();
},[user]);

/* =============================== */

if(loading){
return(
<AdminLayout>
<div className="p-6 text-white/60">
Loading revenue insights...
</div>
</AdminLayout>
);
}

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Revenue Command Center
</h1>

<div className="grid md:grid-cols-4 gap-6">

<div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
<p className="text-white/60">Revenue Today</p>
<p className="text-2xl font-bold">₹{data?.revenueToday || 0}</p>
</div>

<div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
<p className="text-white/60">Orders Today</p>
<p className="text-2xl font-bold">{data?.ordersToday || 0}</p>
</div>

<div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
<p className="text-white/60">Top Product</p>
<p className="text-lg">{data?.topProduct?.name || "None"}</p>
</div>

<div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
<p className="text-white/60">Low Stock Risk</p>
<p className="text-2xl text-red-400">{data?.lowStock || 0}</p>
</div>

</div>

{/* AI OPERATIONS PANEL */}

<div className="mt-12">

<h2 className="text-xl text-purple-400 mb-6">
AI Operations
</h2>

<div className="flex gap-4 flex-wrap">

<button onClick={runTrendHarvester} className="bg-purple-600 px-5 py-2 rounded-lg text-white">
Run AI Trend Harvester
</button>

<button onClick={runMarketingAI} className="bg-pink-600 px-5 py-2 rounded-lg text-white">
Run Marketing AI
</button>

<button onClick={runGrowthAI} className="bg-yellow-600 px-5 py-2 rounded-lg text-white">
Run Growth Engine
</button>

<button onClick={runPricingAI} className="bg-green-600 px-5 py-2 rounded-lg text-white">
Run Pricing AI
</button>

<button onClick={runFraudDetection} className="bg-red-600 px-5 py-2 rounded-lg text-white">
Run Fraud Detection
</button>

<button onClick={runCustomerAI} className="bg-indigo-600 px-5 py-2 rounded-lg text-white">
Run Customer Intelligence
</button>

<button onClick={runStoreManager} className="bg-orange-600 px-5 py-2 rounded-lg text-white">
Run Store Manager
</button>

<button onClick={scanTrends} className="bg-pink-600 px-5 py-2 rounded-lg text-white">
Scan Global Trends
</button>

<button onClick={runDemandForecast} className="bg-yellow-600 px-5 py-2 rounded-lg text-white">
Run Demand Forecast
</button>

<button onClick={runViralPredictor} className="bg-red-600 px-5 py-2 rounded-lg text-white">
Predict Viral Products
</button>

<button onClick={runCompetitorScan} className="bg-indigo-600 px-5 py-2 rounded-lg text-white">
Scan Competitors
</button>

<button onClick={runBehaviorAnalysis} className="bg-green-600 px-5 py-2 rounded-lg text-white">
Analyze Customer Behavior
</button>

<button onClick={runGrowthStrategy} className="bg-purple-600 px-5 py-2 rounded-lg text-white">
Run Growth Strategy
</button>

<button onClick={runSupplierAI} className="bg-blue-600 px-5 py-2 rounded-lg text-white">
Run Supplier Intelligence
</button>

</div>

</div>

</div>

</AdminLayout>

);

}