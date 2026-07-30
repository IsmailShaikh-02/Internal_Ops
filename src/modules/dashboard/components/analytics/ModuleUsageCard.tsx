import { ChartCard } from "@/shared/components/ui/ChartCard";
import type { ModuleUsageItem } from "../../types";

interface ModuleUsageCardProps {
  data: ModuleUsageItem[];
}

export function ModuleUsageCard({ data }: ModuleUsageCardProps) {
  const maxTenants = Math.max(...data.map((item) => item.tenants), 1);

  return (
    <ChartCard
      title="Module usage"
      description="Active tenants per module"
      contentClassName="h-[280px] overflow-y-auto pr-1"
    >
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.tenants / maxTenants) * 100;
          return (
            <div key={item.module} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">{item.module}</span>
                <span className="text-muted-foreground font-mono">{item.tenants} tenants</span>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-slate-900 dark:bg-slate-100 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}
