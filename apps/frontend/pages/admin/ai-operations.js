import { useEffect,useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function AIOperations(){

const {token} = useAuth();

const [data,setData] = useState(null);
const [loading,setLoading] = useState(true);
const [error,setError] = useState(null);

async function load(){

try{

const res = await fetch(
`${API}/api/admin/ai-operations`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const d = await res.json();

if(!d.success){
setError("Failed to load AI operations");
return;
}

setData(d);

}
catch(err){

console.error("AI operations load error:",err);
setError("Server error");

}
finally{
setLoading(false);
}

}

useEffect(()=>{

if(token){
load();
}

},[token]);

if(loading){

return(
<AdminLayout>
<p className="p-6 text-white/60">
Loading AI operations...
</p>
</AdminLayout>
);

}

if(error){

return(
<AdminLayout>
<p className="p-6 text-red-400">
{error}
</p>
</AdminLayout>
);

}

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Operations Center
</h1>

{/* ================= STATS ================= */}

<div className="grid grid-cols-4 gap-6">

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Scheduler</p>
<p className="text-green-400 font-bold">
{data.scheduler}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Pending Decisions</p>
<p className="text-yellow-400 text-2xl">
{data.decisions?.pending || 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Approved</p>
<p className="text-green-400 text-2xl">
{data.decisions?.approved || 0}
</p>
</div>

<div className="bg-black/40 p-4 rounded-xl">
<p className="text-white/60">Rejected</p>
<p className="text-red-400 text-2xl">
{data.decisions?.rejected || 0}
</p>
</div>

</div>

{/* ================= ENGINE HEALTH ================= */}

<h2 className="text-xl mt-10 mb-4 text-cyan-400">
AI Engine Health
</h2>

<div className="bg-black/40 rounded-xl p-4">

{data.engines?.map((e,i)=>{

const status =
e.failures > 3
? "text-red-400"
: e.success === false
? "text-yellow-400"
: "text-green-400";

return(

<div
key={i}
className="border-b border-white/10 py-3 flex justify-between"
>

<div>

<p className="text-white">
{e.engine}
</p>

<p className="text-white/40 text-xs">
Last run:
{e.lastRun
? new Date(e.lastRun).toLocaleString()
: "Never"}
</p>

</div>

<div className={status}>

{e.failures > 3
? "Paused"
: e.success === false
? "Warning"
: "Running"}

</div>

</div>

);

})}

</div>

{/* ================= EXECUTIONS ================= */}

<h2 className="text-xl mt-10 mb-4 text-cyan-400">
Recent AI Executions
</h2>

<div className="bg-black/40 rounded-xl p-4">

{data.recentExecutions?.map((e,i)=>(

<div
key={i}
className="border-b border-white/10 py-2"
>

<p className="text-white">
{e.engineName || e.engine}
</p>

<p className="text-white/50 text-xs">
{new Date(e.createdAt).toLocaleString()}
</p>

</div>

))}

</div>

{/* ================= UPTIME ================= */}

<div className="mt-8 text-white/40 text-xs">
System uptime: {Math.floor(data.uptime)} seconds
</div>

</div>

</AdminLayout>

);

}