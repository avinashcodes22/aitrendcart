import { ProtectedLayout } from "@/components/admin/ProtectedLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database, RefreshCw, Settings, Power } from "lucide-react";
import { toast } from "sonner";

const mockSuppliers = [
  {
    id: "SUP-001",
    name: "FurniSupply",
    type: "API",
    status: "active",
    lastSync: "2 hours ago",
    products: 234,
  },
  {
    id: "SUP-002",
    name: "DeskMart",
    type: "CSV",
    status: "active",
    lastSync: "5 hours ago",
    products: 89,
  },
  {
    id: "SUP-003",
    name: "LightCo",
    type: "API",
    status: "paused",
    lastSync: "1 day ago",
    products: 456,
  },
];

export const SuppliersPage = () => {
  const handleSync = (name: string) => {
    toast.success(`Syncing ${name}...`);
  };

  return (
    <ProtectedLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-orbitron mb-2">
              <span className="text-cyber">Supplier</span> Management
            </h1>
            <p className="text-muted-foreground">
              Configure and monitor data sources
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyber to-cyber-pink hover:opacity-90 neon-glow">
            <Database className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Suppliers Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>Supplier</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSuppliers.map((supplier) => (
                <TableRow key={supplier.id} className="border-border/50 hover:bg-white/5">
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-cyber/50 text-cyber">
                      {supplier.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={supplier.status === "active" ? "default" : "secondary"}
                      className={
                        supplier.status === "active"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }
                    >
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{supplier.lastSync}</TableCell>
                  <TableCell className="font-semibold text-cyber">{supplier.products}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-white/5"
                        onClick={() => handleSync(supplier.name)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:bg-white/5">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:bg-white/5">
                        <Power className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Active Suppliers</p>
            <p className="text-3xl font-bold font-orbitron text-cyber">2</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Total Products</p>
            <p className="text-3xl font-bold font-orbitron text-cyber">779</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-2">Sync Success Rate</p>
            <p className="text-3xl font-bold font-orbitron text-green-500">98.5%</p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default SuppliersPage;
