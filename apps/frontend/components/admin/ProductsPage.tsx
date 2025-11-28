import { ProtectedLayout } from "@/components/admin/ProtectedLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const mockProducts = [
  {
    id: "PRD-001",
    sku: "CHAIR-3D-001",
    title: "Modern Office Chair",
    supplier: "FurniSupply",
    price: "$299.99",
    stock: 45,
    status3D: "Generated",
    licenseStatus: "Verified",
  },
  {
    id: "PRD-002",
    sku: "DESK-3D-002",
    title: "Standing Desk Pro",
    supplier: "DeskMart",
    price: "$599.99",
    stock: 12,
    status3D: "Pending",
    licenseStatus: "Pending",
  },
  {
    id: "PRD-003",
    sku: "LAMP-3D-003",
    title: "LED Task Lamp",
    supplier: "LightCo",
    price: "$79.99",
    stock: 128,
    status3D: "Generated",
    licenseStatus: "Flagged",
  },
];

export const ProductsPage = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-orbitron mb-2">
              <span className="text-cyber">Product</span> Catalog
            </h1>
            <p className="text-muted-foreground">
              Manage 3D products and licensing
            </p>
          </div>
          <Button className="bg-gradient-to-r from-cyber to-cyber-pink hover:opacity-90 neon-glow">
            Add Product
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-10 bg-background/50 border-border/50 focus:border-cyber"
              />
            </div>
            <Button variant="outline" className="border-border/50 hover:bg-white/5">
              Filter
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead>SKU</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>3D Status</TableHead>
                <TableHead>License</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id} className="border-border/50 hover:bg-white/5">
                  <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell className="text-cyber font-semibold">{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.status3D === "Generated" ? "default" : "secondary"}
                      className={product.status3D === "Generated" ? "bg-green-500/20 text-green-500" : ""}
                    >
                      {product.status3D}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.licenseStatus === "Verified"
                          ? "default"
                          : product.licenseStatus === "Flagged"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        product.licenseStatus === "Verified"
                          ? "bg-green-500/20 text-green-500"
                          : product.licenseStatus === "Flagged"
                          ? "bg-red-500/20 text-red-500"
                          : ""
                      }
                    >
                      {product.licenseStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="hover:bg-white/5">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {product.licenseStatus === "Verified" && (
                        <Button size="icon" variant="ghost" className="hover:bg-white/5">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        </Button>
                      )}
                      {product.licenseStatus === "Flagged" && (
                        <Button size="icon" variant="ghost" className="hover:bg-white/5">
                          <XCircle className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                      {product.status3D === "Pending" && (
                        <Button size="icon" variant="ghost" className="hover:bg-white/5">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default ProductsPage;
