import Link from "next/link";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import socket from "../../lib/socket";
import { useAuth } from "../../context/AuthContext";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000";

/* ===================================
   TYPE COLORS
=================================== */

const typeStyles = {
  order: {
    label: "ORDER",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20"
  },

  product: {
    label: "PRODUCT",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20"
  },

  ai: {
    label: "AI",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20"
  },

  security: {
    label: "SECURITY",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20"
  },

  system: {
    label: "SYSTEM",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20"
  }
};

export default function AdminLayout({ children }) {

  const { token } = useAuth();

  const [alerts,setAlerts] = useState([]);
  const [open,setOpen] = useState(false);

  /* =============================
     LOAD OLD NOTIFICATIONS
  ============================== */

  async function loadHistory(){

    if(!token) return;

    try{

      const res = await fetch(
        `${API}/api/admin/notifications`,
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      if(!res.ok) return;

      const data = await res.json();

      if(Array.isArray(data)){
        setAlerts(data);
      }

    }
    catch(err){
      console.error("Notification history error:",err);
    }

  }

  /* =============================
     SOCKET LISTENER
  ============================== */

  useEffect(()=>{

    if(!token) return;

    loadHistory();

    const adminHandler = (n)=>{

      setAlerts(prev => [n,...prev]);

      try{
        new Audio("/notify.mp3").play();
      }catch{}

    };

    const securityHandler = (n)=>{

      const alert = {
        type:"security",
        message:n.message,
        createdAt:new Date()
      };

      setAlerts(prev => [alert,...prev]);

      try{
        new Audio("/alert.mp3").play();
      }catch{}

    };

    socket.on("admin_notification",adminHandler);
    socket.on("security_alert",securityHandler);

    return ()=>{

      socket.off("admin_notification",adminHandler);
      socket.off("security_alert",securityHandler);

    };

  },[token]);

  /* =============================
     CLEAR ALERTS
  ============================== */

  async function clearAlerts(){

    setAlerts([]);

    try{

      await fetch(
        `${API}/api/admin/notifications/read`,
        {
          method:"POST",
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

    }
    catch{}

  }

  /* =============================
     CLOSE DROPDOWN
  ============================== */

  useEffect(()=>{

    const close = ()=>setOpen(false);

    window.addEventListener("click",close);

    return ()=>window.removeEventListener("click",close);

  },[]);

  return(

  <div className="min-h-screen flex bg-gradient-to-br from-[#050816] via-[#0b1120] to-black text-white">

    {/* SIDEBAR */}

    <aside className="w-64 shrink-0 bg-black/60 backdrop-blur-xl border-r border-cyan-500/20 p-5 hidden md:flex flex-col">

      <div className="mb-8 flex items-center gap-3">
        <img src="/logo.png" className="w-10 h-10"/>
        <div>
          <div className="text-cyan-400 font-bold text-lg">
            AItrendcart
          </div>
          <div className="text-xs text-white/60">
            Admin Portal
          </div>
        </div>
      </div>

      <nav className="space-y-2 text-sm flex-1">

        {[
          ["Dashboard","/admin"],
          ["Products","/admin/products"],
          ["Orders","/admin/orders"],
          ["Suppliers","/admin/suppliers"],
          ["AI Engine","/admin/ai-jobs"],
          ["AI Predictions","/admin/predictions"],
          ["License","/admin/license"],
          ["Audit","/admin/audit"],
          ["Settings","/admin/settings"],
          ["AI Insights","/admin/ai-insights"],
          ["AI Product Discovery","/admin/product-discovery"],
          ["AI Control Center","/admin/ai-control"],
          ["Revenue Center","/admin/revenue"],
          ["AI Decisions","/admin/ai-decisions"],
          ["AI Strategy","/admin/ai-strategy"],
          ["Investor Mode","/admin/investor-mode"],
          ["AI Operations","/admin/ai-operations"],
        ].map(([name,path])=>(
          <Link
            key={name}
            href={path}
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            {name}
          </Link>
        ))}

      </nav>

      <div className="text-xs text-white/40 mt-6">
        AItrendcart v1.0
      </div>

    </aside>

    {/* MAIN */}

    <div className="flex-1 flex flex-col">

      {/* TOP BAR */}

      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl">

        <div className="text-lg font-semibold text-cyan-400">
          Admin Dashboard
        </div>

        <div
          className="flex items-center gap-4 relative"
          onClick={(e)=>e.stopPropagation()}
        >

          <button
            onClick={()=>setOpen(!open)}
            className="relative hover:text-cyan-300 transition"
          >

            <Bell className="w-5 h-5"/>

            {alerts.length>0 &&(

              <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded">
                {alerts.length}
              </span>

            )}

          </button>

          {/* DROPDOWN */}

          {open &&(

          <div className="absolute right-0 top-10 w-80 bg-[#050816] border border-cyan-500/30 rounded-xl shadow-lg p-3 z-50">

            <div className="flex justify-between items-center mb-2">

              <div className="text-cyan-400 font-semibold">
                Notifications
              </div>

              {alerts.length>0 &&(

                <button
                  onClick={clearAlerts}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Clear
                </button>

              )}

            </div>

            {alerts.length===0 &&(

              <div className="text-white/50 text-sm">
                No notifications
              </div>

            )}

            <div className="max-h-80 overflow-y-auto space-y-2">

              {alerts.map((n,i)=>{

                const type = n.type?.toLowerCase() || "system";
                const style = typeStyles[type] || typeStyles.system;

                return(

                <div
                  key={n._id || i}
                  className={`border rounded p-2 ${style.bg}`}
                >

                  <div className={`${style.color} font-semibold`}>
                    {style.label}
                  </div>

                  <div className="text-white/80 text-xs">
                    {n.message}
                  </div>

                  <div className="text-white/30 text-[10px]">
                    {new Date(
                      n.createdAt || Date.now()
                    ).toLocaleString()}
                  </div>

                </div>

                );

              })}

            </div>

          </div>

          )}

          <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm font-semibold">
            Emergency Pause
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <main className="flex-1 overflow-y-auto p-6">

        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>

      </main>

    </div>

  </div>

  );

}