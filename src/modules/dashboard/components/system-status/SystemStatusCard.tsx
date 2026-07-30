import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock3,
} from "lucide-react";

import { ChartCard } from "@/shared/components/ui/ChartCard";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { SystemStatusItem, AlertItem } from "../../types";

interface SystemStatusCardProps {
  systemStatus: SystemStatusItem[];
  alerts: AlertItem[];
}

export function SystemStatusCard({ systemStatus, alerts }: SystemStatusCardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "healthy":
        return "success";
      case "warning":
        return "warning";
      case "critical":
        return "critical";
      default:
        return "neutral";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600 shrink-0" />;
      case "warning":
        return <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />;
      case "info":
        return <Info className="mt-0.5 h-4 w-4 text-blue-500 shrink-0" />;
      default:
        return <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 shrink-0" />;
    }
  };

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "critical";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "success";
    }
  };

  return (
    <ChartCard
      title="System Status"
      description="Infrastructure health across regions"
      className="h-full"
    >
      <div className="space-y-6">
        {/* Regions */}
        <div className="space-y-4">
          {systemStatus.map((region) => {
            const variant = getStatusVariant(region.status);
            return (
              <div
                key={region.region}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge variant={variant}>
                    {region.status === "healthy" ? "Operational" : "Degraded"}
                  </StatusBadge>

                  <span className="text-sm font-medium uppercase">
                    {region.region}
                  </span>
                </div>

                <span className="text-sm text-muted-foreground font-mono">
                  {region.latency}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800" />

        {/* Recent Alerts */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">
            Recent Alerts
          </h4>

          <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex items-start gap-3"
              >
                {getAlertIcon(alert.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      variant={getAlertBadgeVariant(alert.type)}
                      className="px-1.5 py-0.2 text-[10px] uppercase font-bold"
                    >
                      {alert.type}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1 shrink-0">
                      <Clock3 className="h-3 w-3" />
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-foreground mt-1 truncate">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}