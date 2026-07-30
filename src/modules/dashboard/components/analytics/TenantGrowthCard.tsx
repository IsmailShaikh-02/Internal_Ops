import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import type { TenantGrowthItem } from "../../types";

interface TenantGrowthCardProps {
  data: TenantGrowthItem[];
}

export function TenantGrowthCard({ data }: TenantGrowthCardProps) {
  return (
    <ChartCard
      title="Total tenants"
      description="Growth over the year"
      contentClassName="h-[280px]"
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e4e4e7)" />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground, #71717a)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground, #71717a)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background, #fff)",
                borderColor: "var(--border, #e4e4e7)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            />
            <Bar
              dataKey="tenants"
              fill="var(--primary, #0f172a)"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
