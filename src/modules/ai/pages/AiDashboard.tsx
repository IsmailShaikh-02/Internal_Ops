import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { Bot, Users, Cpu, DollarSign, CheckCircle2, AlertTriangle, Clock, Activity } from "lucide-react";

// Mock data for dashboard charts
const dailyUsageData = [
  { day: "Aug 10", requests: 2100, tokens: 420000, cost: 84 },
  { day: "Aug 11", requests: 2400, tokens: 480000, cost: 96 },
  { day: "Aug 12", requests: 2800, tokens: 560000, cost: 112 },
  { day: "Aug 13", requests: 3100, tokens: 620000, cost: 124 },
  { day: "Aug 14", requests: 3500, tokens: 700000, cost: 140 },
  { day: "Aug 15", requests: 3300, tokens: 660000, cost: 132 },
  { day: "Aug 16", requests: 2900, tokens: 580000, cost: 116 },
  { day: "Aug 17", requests: 3900, tokens: 780000, cost: 156 },
  { day: "Aug 18", requests: 4200, tokens: 840000, cost: 168 },
  { day: "Aug 19", requests: 4600, tokens: 920000, cost: 184 },
];

const moduleUsageData = [
  { name: "Recruitment", value: 34200 },
  { name: "Support", value: 25800 },
  { name: "HRMS", value: 12400 },
  { name: "Payroll", value: 6800 },
  { name: "General Assistant", value: 3200 },
];

const modelUsageData = [
  { name: "GPT-4o", value: 45000, color: "#0284c7" },
  { name: "Claude 3.5 Sonnet", value: 25000, color: "#f97316" },
  { name: "GPT-3.5 Turbo", value: 12000, color: "#22c55e" },
  { name: "Gemini 1.5 Pro", value: 5000, color: "#a855f7" },
];

export function AiDashboard() {
  const formatK = (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}K` : val.toString());
  const formatM = (val: number) => (val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : formatK(val));

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total AI Requests"
          value="82,400"
          subtitle="Across all tenants"
          icon={<Bot className="h-4 w-4 text-slate-500" />}
          trend={{ value: "+12.3%", direction: "up" }}
        />
        <StatCard
          title="Active AI Users"
          value="1,240"
          subtitle="Monthly active users"
          icon={<Users className="h-4 w-4 text-slate-500" />}
          trend={{ value: "+8.2%", direction: "up" }}
        />
        <StatCard
          title="Total Tokens Used"
          value="42.6M"
          subtitle="Prompt & completion"
          icon={<Cpu className="h-4 w-4 text-slate-500" />}
          trend={{ value: "+8.2%", direction: "up" }}
        />
        <StatCard
          title="Estimated AI Cost"
          value="$8,640"
          subtitle="Incurred this month"
          icon={<DollarSign className="h-4 w-4 text-slate-500" />}
          trend={{ value: "-2.4%", direction: "down" }}
        />
        <StatCard
          title="Successful Responses"
          value="81,908"
          subtitle="99.4% Success rate"
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          trend={{ value: "+0.1%", direction: "up" }}
        />
        <StatCard
          title="Failed Requests"
          value="492"
          subtitle="0.6% Failure rate"
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          trend={{ value: "-15.2%", direction: "down" }}
        />
        <StatCard
          title="Avg Response Time"
          value="812 ms"
          subtitle="End-to-end latency"
          icon={<Clock className="h-4 w-4 text-slate-500" />}
          trend={{ value: "-3.2%", direction: "down" }}
        />
        <StatCard
          title="AI Availability"
          value="99.98%"
          subtitle="System uptime"
          icon={<Activity className="h-4 w-4 text-green-500" />}
          trend={{ value: "Stable", direction: "neutral" }}
        />
      </div>

      {/* Charts Grid */}
      <div className="space-y-6">
  {/* Row 1: Daily AI Requests & Token Consumption (2-column grid) */}
  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
    <ChartCard title="Daily AI Requests" description="Volume of requests over the last 10 days" contentClassName="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyUsageData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#e4e4e7", borderRadius: "8px", fontSize: "12px" }} />
          <Area type="monotone" dataKey="requests" stroke="#0284c7" strokeWidth={2} fill="url(#colorRequests)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Token Consumption" description="Daily prompt and completion tokens (10d)" contentClassName="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dailyUsageData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatM} />
          <Tooltip
            contentStyle={{ backgroundColor: "#fff", borderColor: "#e4e4e7", borderRadius: "8px", fontSize: "12px" }}
            formatter={(val: any) => [Number(val).toLocaleString(), "Tokens"]}
          />
          <Area type="monotone" dataKey="tokens" stroke="#a855f7" strokeWidth={2} fill="url(#colorTokens)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>

  {/* Row 2: Full-Width Cost Trend (Expanded width lets you show more trend data points or a richer view) */}
  <ChartCard title="Cost Trend ($)" description="Comprehensive daily AI cost breakdown over time" contentClassName="h-[320px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dailyUsageData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
        <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
        <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderColor: "#e4e4e7", borderRadius: "8px", fontSize: "12px" }}
          formatter={(val: any) => [`$${val}`, "Cost"]}
        />
        <Bar dataKey="cost" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </ChartCard>

  {/* Row 3: Categorical Breakdowns (Balanced 2-column layout to prevent cramping) */}
  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
    <ChartCard title="AI Requests by Module" description="Distribution of calls per module" contentClassName="h-[280px] overflow-y-auto pr-1">
      <div className="space-y-4">
        {moduleUsageData.map((item) => {
          const max = Math.max(...moduleUsageData.map((d) => d.value));
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.name}</span>
                <span className="text-slate-500 font-mono">{item.value.toLocaleString()} requests</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-900 transition-all duration-500"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>

    <ChartCard title="Model Usage Distribution" description="Requests divided by model" contentClassName="h-[280px] flex items-center justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-around">
        <div className="h-[160px] w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelUsageData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {modelUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {modelUsageData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-semibold text-slate-700">{entry.name}</span>
              <span className="text-slate-500">({((entry.value / 87000) * 100).toFixed(0)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  </div>
</div>
    </div>
  );
}

export default AiDashboard;
