import { Server } from "lucide-react";
import { StatCard } from "@/shared/components/ui/StatCard";
import type { MetricDetail } from "../../types";

export function ServerHealthCard({ value, trend, subtitle }: MetricDetail) {
  return (
    <StatCard
      title="Server health"
      value={value}
      subtitle={subtitle}
      icon={<Server className="h-5 w-5" />}
      trend={{
        value: trend,
        direction: "up", // Green badge for SLO OK
      }}
    />
  );
}
