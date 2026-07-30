import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import type { AiTokenUsageItem } from "../../types";

interface AiTokenUsageCardProps {
  data: AiTokenUsageItem[];
}

export function AiTokenUsageCard({ data }: AiTokenUsageCardProps) {
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}K`;
    }
    return `${val}`;
  };

  return (
    <ChartCard
      title="AI token usage"
      description="Token consumption trend (14d)"
      contentClassName="h-[280px]"
    >
      <div className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tokens, #0ea5e9)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--color-tokens, #0ea5e9)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border, #e4e4e7)" />
            <XAxis
              dataKey="day"
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
              tickFormatter={formatYAxis}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--background, #fff)",
                borderColor: "var(--border, #e4e4e7)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
              formatter={(val: any) => [Number(val || 0).toLocaleString(), "Tokens"]}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="#0284c7"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorTokens)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
