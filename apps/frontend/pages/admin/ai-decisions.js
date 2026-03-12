import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function AiDecisions(){

const { token } = useAuth();

const [decisions,setDecisions] = useState([]);
const [loading,setLoading] = useState(true);

/* ===============================
   LOAD DECISIONS
================================ */

async function loadDecisions(){

const res = await fetch(
`${API}/api/admin/ai-decisions`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = await res.json();

setDecisions(data || []);
setLoading(false);

}

/* ===============================
   APPROVE
================================ */

async function approve(id){

await fetch(
`${API}/api/admin/ai-decisions/${id}/approve`,
{
method:"POST",
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadDecisions();

}

/* ===============================
   REJECT
================================ */

async function reject(id){

await fetch(
`${API}/api/admin/ai-decisions/${id}/reject`,
{
method:"POST",
headers:{
Authorization:`Bearer ${token}`
}
}
);

loadDecisions();

}

useEffect(()=>{

if(token){
loadDecisions();
}

},[token]);

/* ===============================
   UI
================================ */

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Decisions
</h1>

{loading && (
<p className="text-white/60">
Loading AI decisions...
</p>
)}

{!loading && decisions.length===0 && (
<p className="text-white/60">
No pending AI decisions
</p>
)}

{!loading && decisions.length>0 && (

<div className="overflow-x-auto border border-cyan-500/20 rounded-xl">

<table className="min-w-full text-sm">

<thead className="bg-cyan-500/10 text-cyan-300">

<tr>
<th className="p-3 text-left">Type</th>
<th className="p-3 text-left">Entity</th>
<th className="p-3 text-left">Suggestion</th>
<th className="p-3 text-left">Reason</th>
<th className="p-3 text-left">Actions</th>
</tr>

</thead>

<tbody>

{decisions.map((d)=>(
<tr
key={d._id}
className="border-t border-cyan-500/10"
>

<td className="p-3 text-white">
{d.type}
</td>

<td className="p-3 text-white">
{d.entity}
</td>

<td className="p-3 text-white text-xs">
{JSON.stringify(d.suggestion)}
</td>

<td className="p-3 text-white text-xs">
{d.reason}
</td>

<td className="p-3 flex gap-2">

<button
onClick={()=>approve(d._id)}
className="bg-green-600 px-3 py-1 rounded text-white"
>
Approve
</button>

<button
onClick={()=>reject(d._id)}
className="bg-red-600 px-3 py-1 rounded text-white"
>
Reject
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>

)}

</div>

</AdminLayout>

);

}