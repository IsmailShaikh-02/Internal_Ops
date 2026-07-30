import { Bot } from "lucide-react";
import { StatCard } from "@/shared/components/ui/StatCard";
import type { MetricDetail } from "../../types";

export function AiCostCard({ value, trend, subtitle }: MetricDetail) {
  // A decrease in AI spend is a positive trend (cost savings), so we display a green badge (direction: "up")
  return (
    <div className="relative">
      <StatCard
        title="AI spend (Month)"
        value={value}
        subtitle={subtitle}
        icon={<Bot className="h-5 w-5" />}
        trend={{
          value: trend,
          direction: "up",
        }}
      /></div>
  );
}