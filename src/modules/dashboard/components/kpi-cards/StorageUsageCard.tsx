import { HardDrive } from "lucide-react";
import { StatCard } from "@/shared/components/ui/StatCard";
import type { MetricDetail } from "../../types";

export function StorageUsageCard({ value, trend, subtitle }: MetricDetail) {
  return (
    <StatCard
      title="Storage usage"
      value={value}
      subtitle={subtitle}
      icon={<HardDrive className="h-5 w-5" />}
      trend={{
        value: trend,
        direction: "down", // Show red badge for increase in storage consumption as per mockup
      }}
    />
  );
}