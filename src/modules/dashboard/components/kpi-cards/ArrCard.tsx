import { BadgeDollarSign } from "lucide-react";
import { StatCard } from "@/shared/components/ui/StatCard";
import type { MetricDetail } from "../../types";

export function ArrCard({ value, trend, subtitle }: MetricDetail) {
  const formattedValue = typeof value === "number" ? `$${value.toLocaleString()}` : value;
  const isUp = trend.startsWith("+");
  const isDown = trend.startsWith("-");
  const direction = isUp ? "up" : isDown ? "down" : "neutral";

  return (
    <StatCard
      title="ARR"
      value={formattedValue}
      subtitle={subtitle}
      icon={<BadgeDollarSign className="h-5 w-5" />}
      trend={{
        value: trend,
        direction,
      }}
    />
  );
}