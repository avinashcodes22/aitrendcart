"use client";

import { LayoutDashboard, Package, Cpu, ShieldCheck, FileText, Settings, Database } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Suppliers", icon: Database, path: "/admin/suppliers" },
  { title: "Products", icon: Package, path: "/admin/products" },
  { title: "AI Engine", icon: Cpu, path: "/admin/ai-jobs" },
  { title: "License Ledger", icon: ShieldCheck, path: "/admin/license" },
  { title: "Audit Logs", icon: FileText, path: "/admin/audit" },
  { title: "Settings", icon: Settings, path: "/admin/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-card border-r border-border/50 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber to-cyber-pink flex items-center justify-center neon-glow">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-orbitron text-cyber">AI</h1>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
              "hover:bg-white/5 hover:translate-x-1 group"
            )}
            activeClassName="bg-gradient-to-r from-cyber/20 to-cyber-pink/20 border border-cyber/30 neon-glow"
          >
            <item.icon className="w-5 h-5 group-hover:text-cyber transition-colors" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
        <div className="glass-card p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">© 2025 AItrendcart</p>
          <p className="text-[10px] text-cyber mt-1">Admin Dashboard v1.0</p>
        </div>
      </div>
    </aside>
  );
};
