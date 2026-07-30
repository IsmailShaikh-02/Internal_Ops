import { CreditCard } from "lucide-react";

import { StatCard } from "@/shared/components/ui/StatCard";

export function SubscriptionSummaryCard() {
  return (
    <StatCard
      title="Subscriptions"
      value="318"
      subtitle="286 Active • 22 Trial • 10 Past Due"
      icon={<CreditCard className="h-5 w-5" />}
      trend={{
        value: "+8",
        direction: "up",
      }}
    />
  );
}   