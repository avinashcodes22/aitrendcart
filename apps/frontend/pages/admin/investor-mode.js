import { useEffect,useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function InvestorMode(){

const {token} = useAuth();

const [data,setData] = useState(null);

async function load(){

const res = await fetch(
`${API}/api/admin/investor-mode`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const d = await res.json();

setData(d);

}

useEffect(()=>{

if(token){
load();
}

},[token]);

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

<p className="text-white/60">
Total Revenue
</p>

<p className="text-2xl font-bold text-green-400">
₹{data.revenue}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Orders
</p>

<p className="text-2xl font-bold">
{data.totalOrders}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Products
</p>

<p className="text-2xl font-bold">
{data.products}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
AI Decisions
</p>

<p className="text-2xl font-bold">
{data.aiDecisions}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
AI Approved
</p>

<p className="text-2xl font-bold text-green-400">
{data.aiApproved}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Projected Monthly Revenue
</p>

<p className="text-2xl font-bold text-cyan-400">
₹{data.projectedMonthlyRevenue}
</p>

</div>

</div>

</div>

</AdminLayout>

);

}