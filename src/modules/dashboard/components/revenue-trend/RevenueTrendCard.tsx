import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/shared/components/ui/button";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import type { RevenueTrend } from "../../types";

interface RevenueTrendCardProps {
  data: RevenueTrend;
}

export function RevenueTrendCard({ data }: RevenueTrendCardProps) {
  const [range, setRange] = useState<keyof RevenueTrend>("12M");

  const chartData = data[range];

  // Helper to format currency values (e.g. 280000 -> $280K)
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val}`;
  };

  // Helper to format tooltip currency values
  const formatTooltip = (val: any) => {
    return [`$${Number(val || 0).toLocaleString()}`, "MRR"];
  };

  return (
    <ChartCard
      title="Revenue trend"
      description="MRR, new revenue and churn"
      actions={
        <div className="flex items-center gap-1.5 rounded-lg border bg-muted/40 p-1">
          <Button
            variant={range === "12M" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRange("12M")}
            className="h-7 text-xs px-2.5"
          >
            12M
          </Button>
          <Button
            variant={range === "6M" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRange("6M")}
            className="h-7 text-xs px-2.5"
          >
            6M
          </Button>
          <Button
            variant={range === "30D" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setRange("30D")}
            className="h-7 text-xs px-2.5"
          >
            30D
          </Button>
        </div>
      }
    >
      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mrr, #3b82f6)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-mrr, #3b82f6)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e4e4e7)" />
            <XAxis
              dataKey={range === "30D" ? "day" : "month"}
              stroke="var(--muted-foreground, #71717a)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--muted-foreground, #71717a)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              dx={-5}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background, #fff)",
                borderColor: "var(--border, #e4e4e7)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--foreground, #09090b)",
              }}
              formatter={formatTooltip}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="mrr"
              stroke="var(--color-mrr-line, #2563eb)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMrr)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}