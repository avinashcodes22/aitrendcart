import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import AIDecisionsPanel from "../../components/admin/AIDecisionsPanel";

const API =
process.env.NEXT_PUBLIC_API_BASE_URL ||
"http://localhost:5000";

export default function AiDecisions(){

const { user } = useAuth();

const [decisions,setDecisions] = useState([]);
const [loading,setLoading] = useState(true);
const [view,setView] = useState("ai");

/* ===============================
   LOAD DECISIONS
================================ */

async function loadDecisions(){

if (!user) {
  setLoading(false);
  return;
}

try {

const token = await user.getIdToken();

const res = await fetch(
`${API}/api/admin/ai-decisions`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

if (!res.ok) {
  const text = await res.text();
  console.error("Decisions error:", text);
  setDecisions([]);
  return;
}

const data = await res.json();

const parsed =
  data?.decisions ||
  data?.data ||
  (Array.isArray(data) ? data : []);

setDecisions(parsed);

} catch (err) {
  console.error("Decision load error:", err);
  setDecisions([]);
}

setLoading(false);

}

/* ===============================
   APPROVE / REJECT
================================ */

async function approve(id){
try {
const token = await user.getIdToken();

await fetch(
`${API}/api/admin/ai-decisions/${id}/approve`,
{
method:"POST",
headers:{ Authorization:`Bearer ${token}` }
}
);

loadDecisions();

} catch (err) {
console.error("Approve error:", err);
}
}

async function reject(id){
try {
const token = await user.getIdToken();

await fetch(
`${API}/api/admin/ai-decisions/${id}/reject`,
{
method:"POST",
headers:{ Authorization:`Bearer ${token}` }
}
);

loadDecisions();

} catch (err) {
console.error("Reject error:", err);
}
}

useEffect(()=>{
loadDecisions();
},[user]);

/* ===============================
   UI
================================ */

return(

<AdminLayout>

<div className="p-6">

<h1 className="text-2xl font-bold text-cyan-400 mb-6">
AI Decisions
</h1>

{/* TOGGLE */}
<div className="flex gap-3 mb-6">

<button
onClick={()=>setView("ai")}
className={`px-4 py-2 rounded ${
view==="ai"
? "bg-cyan-500 text-black"
: "bg-white/10 text-white"
}`}
>
AI View
</button>

<button
onClick={()=>setView("table")}
className={`px-4 py-2 rounded ${
view==="table"
? "bg-cyan-500 text-black"
: "bg-white/10 text-white"
}`}
>
Table View
</button>

</div>

{/* ===============================
   AI VIEW (FIXED)
================================ */}

{view==="ai" && (

<AIDecisionsPanel
decisions={decisions}
loading={loading}
onApprove={approve}
onReject={reject}
/>

)}

{/* ===============================
   TABLE VIEW (UNCHANGED)
================================ */}

{view==="table" && (

<>

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

</>

)}

</div>

</AdminLayout>

);

}