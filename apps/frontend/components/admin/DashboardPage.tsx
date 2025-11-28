import { ProtectedLayout } from "@/components/admin/ProtectedLayout";
import { KpiCard } from "@/components/admin/KpiCard";
import { Scene3D } from "@/components/admin/Scene3D";
import { Database, Package, Cpu, AlertTriangle, RefreshCw, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const DashboardPage = () => {
  const handleSyncAll = () => {
    toast.success("Syncing all suppliers...");
  };

  const handleEmergencyPause = (checked: boolean) => {
    if (checked) {
      toast.warning("Emergency pause activated - all AI jobs stopped");
    } else {
      toast.info("AI processing resumed");
    }
  };

  return (
    <ProtectedLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-orbitron mb-2">
              <span className="text-cyber">Command</span> Center
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring and control
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleSyncAll}
              className="bg-gradient-to-r from-cyber to-cyber-pink hover:opacity-90 neon-glow"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync All Suppliers
            </Button>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-lg">
              <Pause className="w-4 h-4 text-destructive" />
              <Label htmlFor="emergency-pause" className="text-sm">Emergency Pause</Label>
              <Switch 
                id="emergency-pause"
                onCheckedChange={handleEmergencyPause}
              />
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Suppliers Online"
            value={12}
            icon={Database}
            trend={{ value: "+2 this week", isPositive: true }}
          />
          <KpiCard
            title="Products Synced"
            value="1,247"
            icon={Package}
            trend={{ value: "+15% vs last week", isPositive: true }}
          />
          <KpiCard
            title="AI Jobs Pending"
            value={34}
            icon={Cpu}
            trend={{ value: "-8% processing time", isPositive: true }}
          />
          <KpiCard
            title="License Flags"
            value={3}
            icon={AlertTriangle}
            trend={{ value: "2 new today", isPositive: false }}
          />
        </div>

        {/* 3D Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 font-orbitron">
                AI Trend Visualization
              </h2>
              <Scene3D />
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">
                System Status
              </h3>
              <div className="space-y-3">
                <StatusItem label="Database" status="operational" />
                <StatusItem label="AI Workers" status="operational" />
                <StatusItem label="Storage" status="operational" />
                <StatusItem label="License API" status="warning" />
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 font-orbitron">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start border-border/50 hover:bg-white/5">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start border-border/50 hover:bg-white/5">
                  <Database className="w-4 h-4 mr-2" />
                  Configure Supplier
                </Button>
                <Button variant="outline" className="w-full justify-start border-border/50 hover:bg-white/5">
                  <Cpu className="w-4 h-4 mr-2" />
                  Queue AI Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

const StatusItem = ({ label, status }: { label: string; status: "operational" | "warning" | "error" }) => {
  const colors = {
    operational: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
        <span className="text-xs capitalize">{status}</span>
      </div>
    </div>
  );
};

export default DashboardPage;
