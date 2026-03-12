import { useEffect,useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function AIStrategy(){

const {token} = useAuth();

const [data,setData] = useState(null);

async function load(){

const res = await fetch(
`${API}/api/admin/ai-strategy`,
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
<p>Loading AI Strategy...</p>
</AdminLayout>
);

}

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Strategy Control Tower
</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Pending AI Decisions
</p>

<p className="text-2xl font-bold text-yellow-400">
{data.pendingDecisions}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Approved Decisions
</p>

<p className="text-2xl font-bold text-green-400">
{data.approvedDecisions}
</p>

</div>

<div className="bg-black/40 p-4 rounded-xl">

<p className="text-white/60">
Rejected Decisions
</p>

<p className="text-2xl font-bold text-red-400">
{data.rejectedDecisions}
</p>

</div>

</div>

<h2 className="text-xl mt-10 mb-4 text-cyan-400">
Recent AI Executions
</h2>

<div className="bg-black/40 rounded-xl p-4">

{data.recentAIExecutions.map((e,i)=>(

<div
key={i}
className="border-b border-white/10 py-2"
>

<p className="text-white">
{e.engineName}
</p>

<p className="text-white/50 text-xs">
{new Date(e.createdAt).toLocaleString()}
</p>

</div>

))}

</div>

</div>

</AdminLayout>

);

}