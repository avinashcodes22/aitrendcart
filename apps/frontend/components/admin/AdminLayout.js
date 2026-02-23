import Link from "next/link";
import { Bell } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#050816] text-white">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-cyan-500/20 p-5 hidden md:block">

        {/* LOGO */}
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/logo.png"
            alt="AItrendcart"
            className="w-10 h-10 object-contain"
          />
          <div>
            <div className="text-cyan-400 font-bold text-lg">
              AItrendcart
            </div>
            <div className="text-xs text-white/60">
              Admin Portal
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-3 text-sm">

          <Link
            href="/admin"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/products"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Products
          </Link>

          <Link
            href="/admin/orders"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Orders
          </Link>

          <Link
            href="/admin/suppliers"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Suppliers
          </Link>

          <Link
            href="/admin/ai"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            AI Engine
          </Link>

          <Link
            href="/admin/license"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            License Ledger
          </Link>

          <Link
            href="/admin/audit"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Audit Logs
          </Link>

          <Link
            href="/admin/settings"
            className="block px-3 py-2 rounded hover:bg-cyan-500/10"
          >
            Settings
          </Link>

        </nav>

        <div className="mt-12 text-xs text-white/40">
          AItrendcart v1.0
        </div>

      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6 relative">

        {/* ======= TOP BAR ======= */}
        <div className="flex justify-end items-center gap-4 mb-6">

          {/* NOTIFICATIONS */}
          <button className="relative text-white hover:text-cyan-300 transition">
            <Bell className="w-5 h-5" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded">
              2
            </span>
          </button>

          {/* EMERGENCY BUTTON */}
          <button className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-md text-sm font-semibold shadow">
            🚨 Emergency Pause
          </button>

        </div>

        {/* ======= MAIN CARD ======= */}
        <div className="
          bg-black/30
          backdrop-blur-xl
          border border-cyan-500/20
          rounded-2xl
          p-6
          shadow-[0_0_25px_rgba(0,255,255,0.2)]
        ">
          {children}
        </div>

      </main>

    </div>
  );
}