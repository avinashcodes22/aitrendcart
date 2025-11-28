import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const KpiCard = ({ title, value, icon: Icon, trend, className }: KpiCardProps) => {
  return (
    <div className={cn("glass-card p-6 rounded-xl hover-glow", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold font-orbitron text-cyber mb-2">
            {value}
          </h3>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber/20 to-cyber-pink/20 flex items-center justify-center neon-glow">
          <Icon className="w-6 h-6 text-cyber" />
        </div>
      </div>
    </div>
  );
};
