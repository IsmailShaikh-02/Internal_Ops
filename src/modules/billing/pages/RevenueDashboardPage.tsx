import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { mockRevenueTrend } from "../data/mockData";
import { DollarSign, Landmark, UserPlus, Users2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function RevenueDashboardPage() {
  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val}`;
  };

  const formatTooltip = (val: any) => {
    return [`$${Number(val || 0).toLocaleString()}`, "Revenue"];
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="MRR"
          value="$284,500"
          subtitle="Monthly Recurring Revenue"
          icon={<DollarSign className="h-4 w-4 text-slate-600" />}
          trend={{ value: "+4.2%", direction: "up" }}
        />
        <StatCard
          title="ARR"
          value="$3,414,000"
          subtitle="Annual Run Rate"
          icon={<Landmark className="h-4 w-4 text-slate-600" />}
          trend={{ value: "+11.6%", direction: "up" }}
        />
        <StatCard
          title="Net new (MTD)"
          value="$58,400"
          subtitle="Month to date growth"
          icon={<UserPlus className="h-4 w-4 text-slate-600" />}
          trend={{ value: "+8.7%", direction: "up" }}
        />
        <StatCard
          title="Churn (MTD)"
          value="$9,200"
          subtitle="Month to date churn"
          icon={<Users2 className="h-4 w-4 text-slate-600" />}
          trend={{ value: "-1.1%", direction: "down" }}
        />
      </div>

      {/* Revenue Trend Area Chart */}
      <ChartCard
        title="Revenue trend (12M)"
        description="12-month trailing recurring revenue trajectory."
      >
        <div className="h-[320px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockRevenueTrend}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxis}
                dx={-5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderColor: "#e2e8f0",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#0f172a",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
                formatter={formatTooltip}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1e3a8a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
export default RevenueDashboardPage;
