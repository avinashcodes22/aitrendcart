import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AiControlPage(){

  const { user } = useAuth(); // ✅ FIXED

  const [stats,setStats] = useState(null);
  const [loading,setLoading] = useState(true);

  /* ===============================
     LOAD STATS
  =============================== */

  async function loadStats(){

    if (!user) {
      setLoading(false);
      return;
    }

    try{

      const token = await user.getIdToken(); // ✅ FIXED

      const res = await fetch(
        `${API}/api/admin/workers`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Worker stats error:", text);
        setStats(null);
        return;
      }

      const data = await res.json();

      if(data.success){
        setStats(data.stats);
      } else {
        setStats(null);
      }

    }catch(err){
      console.error("Worker stats error:",err);
      setStats(null);
    }

    setLoading(false);

  }

  /* ===============================
     ACTIONS
  =============================== */

  async function pauseWorkers(){

    try {

      const token = await user.getIdToken(); // ✅ FIXED

      await fetch(
        `${API}/api/admin/workers/pause`,
        {
          method:"POST",
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      loadStats();

    } catch (err) {
      console.error("Pause error:", err);
    }

  }

  async function resumeWorkers(){

    try {

      const token = await user.getIdToken(); // ✅ FIXED

      await fetch(
        `${API}/api/admin/workers/resume`,
        {
          method:"POST",
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      loadStats();

    } catch (err) {
      console.error("Resume error:", err);
    }

  }

  useEffect(()=>{

    loadStats();

  },[user]);

  /* ===============================
     UI (UNCHANGED)
  =============================== */

  return(

    <AdminLayout>

      <div className="p-6">

        <h1 className="text-2xl font-bold text-cyan-400 mb-6">
          AI Control Center
        </h1>

        {loading && (
          <p className="text-white/60">
            Loading worker stats...
          </p>
        )}

        {!loading && !stats && (
          <p className="text-white/60">
            No worker data available
          </p>
        )}

        {stats && (

          <div className="space-y-6">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <Card title="Waiting Jobs" value={stats.waiting}/>
              <Card title="Active Jobs" value={stats.active}/>
              <Card title="Completed Jobs" value={stats.completed}/>
              <Card title="Failed Jobs" value={stats.failed}/>

            </div>

            <div className="flex gap-4">

              <button
                onClick={pauseWorkers}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Pause Workers
              </button>

              <button
                onClick={resumeWorkers}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              >
                Resume Workers
              </button>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>

  );

}

function Card({title,value}){

  return(

    <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4">

      <div className="text-white/60 text-xs">
        {title}
      </div>

      <div className="text-xl font-bold text-white">
        {value ?? 0}
      </div>

    </div>

  );

}