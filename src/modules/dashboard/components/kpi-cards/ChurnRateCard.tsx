import { TrendingDown } from "lucide-react";

import { StatCard } from "@/shared/components/ui/StatCard";

export function ChurnRateCard() {
  return (
    <StatCard
      title="Monthly Churn"
      value="1.8%"
      subtitle="Compared to previous month"
      icon={<TrendingDown className="h-5 w-5" />}
      trend={{
        value: "-0.3%",
        direction: "up",
      }}
    />
  );
}