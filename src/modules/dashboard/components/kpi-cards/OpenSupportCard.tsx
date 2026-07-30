import { LifeBuoy } from "lucide-react";
import { StatCard } from "@/shared/components/ui/StatCard";
import type { MetricDetail } from "../../types";

export function OpenSupportCard({ value, trend, subtitle }: MetricDetail) {
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value;
  // A decrease in open tickets is a positive trend, so we use direction "up" (green badge)
  return (
    <StatCard
      title="Open tickets"
      value={formattedValue}
      subtitle={subtitle}
      icon={<LifeBuoy className="h-5 w-5" />}
      trend={{
        value: trend,
        direction: "up",
      }}
    />
  );
}