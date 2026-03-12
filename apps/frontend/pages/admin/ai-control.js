import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

export default function AiControlPage(){

  const { token } = useAuth();

  const [stats,setStats] = useState(null);
  const [loading,setLoading] = useState(true);

  async function loadStats(){

    try{

      const res = await fetch(
        `${API}/api/admin/workers`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if(data.success){
        setStats(data.stats);
      }

    }catch(err){
      console.error("Worker stats error:",err);
    }

    setLoading(false);

  }

  async function pauseWorkers(){

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

  }

  async function resumeWorkers(){

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

  }

  useEffect(()=>{

    if(token){
      loadStats();
    }

  },[token]);

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
        {value}
      </div>

    </div>

  );

}