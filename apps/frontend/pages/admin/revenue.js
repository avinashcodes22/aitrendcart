import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function Revenue() {

  const { token } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [runningHarvester, setRunningHarvester] = useState(false);
  const [runningSupplierAI, setRunningSupplierAI] = useState(false);

  /* =================================
     LOAD REVENUE DATA
  ================================= */

  async function load() {

    try {

      const res = await fetch(
        `${API}/api/admin/revenue-insights`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const d = await res.json();

      setData(d);

    } catch (err) {

      console.error("Revenue load error:", err);

    }

    setLoading(false);
  }

  async function runMarketingAI(){

  const res = await fetch(
    `${API}/api/admin/run-marketing-ai`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Marketing AI finished");

}
async function runPricingAI(){

  const res = await fetch(
    `${API}/api/admin/run-pricing-ai`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Pricing AI finished");

}

async function runGrowthAI(){

  const res = await fetch(
    `${API}/api/admin/run-growth-ai`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Growth engine finished");

}
async function runFraudDetection(){

  const res = await fetch(
    `${API}/api/admin/run-fraud-detection`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Fraud detection completed");

}
async function runCustomerAI(){

  const res = await fetch(
    `${API}/api/admin/run-customer-ai`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Customer intelligence completed");

}
async function runStoreManager(){

  const res = await fetch(
    `${API}/api/admin/run-store-manager`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Store manager completed");

}

async function runViralPredictor(){

  const res = await fetch(
    `${API}/api/admin/run-viral-predictor`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Viral predictions: ${data.predictions}`);

}
  /* =================================
     RUN TREND HARVESTER
  ================================= */

  async function runTrendHarvester() {

    try {

      setRunningHarvester(true);

      const res = await fetch(
        `${API}/api/admin/harvest-trends`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await res.json();

      alert(result.message || "Trend harvesting completed");

    } catch (err) {

      console.error("Trend harvester error:", err);
      alert("Trend harvesting failed");

    }

    setRunningHarvester(false);
  }

  async function scanTrends(){

  const res = await fetch(
    `${API}/api/admin/scan-trends`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(data.message || "Trend scan completed");

}

async function runDemandForecast(){

  const res = await fetch(
    `${API}/api/admin/run-demand-forecast`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Demand alerts: ${data.alerts}`);

}

async function runCompetitorScan(){

  const res = await fetch(
    `${API}/api/admin/run-competitor-intel`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Competitor alerts: ${data.alerts}`);

}

async function runGrowthStrategy(){

  const res = await fetch(
    `${API}/api/admin/run-growth-strategy`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Growth strategies: ${data.strategies}`);

}

async function runMarketingAI(){

  const res = await fetch(
    `${API}/api/admin/run-marketing-ai`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Marketing campaigns suggested: ${data.campaigns}`);

}

async function runStoreManager(){

  const res = await fetch(
    `${API}/api/admin/run-store-manager`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert("AI Store Manager completed");

}

async function runBehaviorAnalysis(){

  const res = await fetch(
    `${API}/api/admin/run-behavior-analysis`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  alert(`Behavior insights: ${data.insights}`);

}

  /* =================================
     RUN SUPPLIER INTELLIGENCE
  ================================= */

  async function runSupplierAI() {

    try {

      setRunningSupplierAI(true);

      const res = await fetch(
        `${API}/api/admin/analyze-suppliers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await res.json();

      alert(result.message || "Supplier analysis finished");

    } catch (err) {

      console.error("Supplier AI error:", err);
      alert("Supplier analysis failed");

    }

    setRunningSupplierAI(false);
  }

  useEffect(() => {

    if (token) {
      load();
    }

  }, [token]);

  /* =================================
     LOADING STATE
  ================================= */

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-white/60">
          Loading revenue insights...
        </div>
      </AdminLayout>
    );
  }

  return (

    <AdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          AI Revenue Command Center
        </h1>

        {/* =================================
            REVENUE DASHBOARD CARDS
        ================================= */}

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
            <p className="text-white/60">Revenue Today</p>
            <p className="text-2xl font-bold">
              ₹{data?.revenueToday || 0}
            </p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
            <p className="text-white/60">Orders Today</p>
            <p className="text-2xl font-bold">
              {data?.ordersToday || 0}
            </p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
            <p className="text-white/60">Top Product</p>
            <p className="text-lg">
              {data?.topProduct?.name || "None"}
            </p>
          </div>

          <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/20">
            <p className="text-white/60">Low Stock Risk</p>
            <p className="text-2xl text-red-400">
              {data?.lowStock || 0}
            </p>
          </div>

        </div>

        {/* =================================
            AI OPERATIONS PANEL
        ================================= */}

        <div className="mt-12">

          <h2 className="text-xl text-purple-400 mb-6">
            AI Operations
          </h2>

          <div className="flex gap-4 flex-wrap">

            {/* TREND HARVESTER */}

            <button
              onClick={runTrendHarvester}
              disabled={runningHarvester}
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white"
            >
              {runningHarvester
                ? "Running Trend Harvester..."
                : "Run AI Trend Harvester"}
            </button>

            <button
onClick={runMarketingAI}
className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Marketing AI
</button>

<button
onClick={runGrowthAI}
className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Growth Engine
</button>

<button
onClick={runPricingAI}
className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Pricing AI
</button>

<button
onClick={runFraudDetection}
className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Fraud Detection
</button>

<button
onClick={runCustomerAI}
className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Customer Intelligence
</button>
<button
onClick={runStoreManager}
className="bg-orange-600 hover:bg-orange-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Store Manager
</button>

<button
onClick={scanTrends}
className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg text-white ml-4"
>
Scan Global Trends
</button>

<button
onClick={runDemandForecast}
className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Demand Forecast
</button>

<button
onClick={runViralPredictor}
className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white ml-4"
>
Predict Viral Products
</button>

<button
onClick={runCompetitorScan}
className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded-lg text-white ml-4"
>
Scan Competitors
</button>

<button
onClick={runBehaviorAnalysis}
className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white ml-4"
>
Analyze Customer Behavior
</button>

<button
onClick={runMarketingAI}
className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Marketing AI
</button>

<button
onClick={runGrowthStrategy}
className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run Growth Strategy
</button>

<button
onClick={runStoreManager}
className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg text-white ml-4"
>
Run AI Store Manager
</button>
            {/* SUPPLIER INTELLIGENCE */}

            <button
              onClick={runSupplierAI}
              disabled={runningSupplierAI}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white"
            >
              {runningSupplierAI
                ? "Running Supplier Intelligence..."
                : "Run Supplier Intelligence"}
            </button>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}