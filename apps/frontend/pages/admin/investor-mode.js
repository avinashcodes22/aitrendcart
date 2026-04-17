import { useEffect,useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function InvestorMode(){

const { user } = useAuth(); // ✅ FIXED

const [data,setData] = useState(null);
const [error,setError] = useState(null);

/* ===============================
   LOAD DATA
================================ */

async function load(){

if (!user) return;

try {

const token = await user.getIdToken(); // ✅ FIXED

const res = await fetch(
`${API}/api/admin/investor-mode`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

if (!res.ok) {
  const text = await res.text();
  console.error("Investor mode error:", text);
  setError("Failed to load investor data");
  return;
}

const d = await res.json();

setData(d);

} catch (err) {

console.error("Investor load error:", err);
setError("Server error");

}

}

useEffect(()=>{

load();

},[user]);

/* ===============================
   UI (UNCHANGED)
================================ */

if(error){

return(
<AdminLayout>
<p className="p-6 text-red-400">
{error}
</p>
</AdminLayout>
);

}

if(!data){

return(
<AdminLayout>
<p>Loading investor analytics...</p>
</AdminLayout>
);

}

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Investor Mode
</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Total Revenue</p>
<p className="text-2xl font-bold text-green-400">
₹{data.revenue ?? 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Orders</p>
<p className="text-2xl font-bold">
{data.totalOrders ?? 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Products</p>
<p className="text-2xl font-bold">
{data.products ?? 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">AI Decisions</p>
<p className="text-2xl font-bold">
{data.aiDecisions ?? 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">AI Approved</p>
<p className="text-2xl font-bold text-green-400">
{data.aiApproved ?? 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Projected Monthly Revenue</p>
<p className="text-2xl font-bold text-cyan-400">
₹{data.projectedMonthlyRevenue ?? 0}
</p>
</div>

</div>

</div>

</AdminLayout>

);

}