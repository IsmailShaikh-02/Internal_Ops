import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useAiStore } from "../hooks/useAiState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { StatCard } from "@/shared/components/ui/StatCard";
import { Star, TrendingUp, ShieldAlert, Cpu } from "lucide-react";
import { mockAnalyticsMetrics } from "../data/mockData";

// Mock Performance trend data
const performanceTrendData = [
  { time: "09:00", gpt4o: 1100, claude: 1650, gemini: 2100 },
  { time: "11:00", gpt4o: 1200, claude: 1720, gemini: 2050 },
  { time: "13:00", gpt4o: 1050, claude: 1580, gemini: 1980 },
  { time: "15:00", gpt4o: 1300, claude: 1810, gemini: 2200 },
  { time: "17:00", gpt4o: 1250, claude: 1790, gemini: 2150 },
];

export function AiAnalytics() {
  const { usageRequests } = useAiStore();

  // Calculated Stats
  const stats = useMemo(() => {
    const total = usageRequests.length;
    const successes = usageRequests.filter((r) => r.status === "success").length;
    const failures = total - successes;
    const successRate = total > 0 ? ((successes / total) * 100).toFixed(1) : "100";
    const avgLatency = total > 0 ? Math.round(usageRequests.reduce((sum, r) => sum + r.processingTime, 0) / total) : 0;
    
    return {
      successRate,
      failures,
      avgLatency,
      adoptionRate: "84.2%"
    };
  }, [usageRequests]);

  // Columns for feature analytics table
  const columns = [
    {
      key: "featureName",
      header: "Feature Name",
      render: (row: any) => <span className="font-semibold text-slate-800">{row.featureName}</span>,
    },
    {
      key: "requestsCount",
      header: "Requests Count",
      render: (row: any) => <span className="font-mono text-sm">{row.requestsCount.toLocaleString()}</span>,
    },
    {
      key: "adoptionRate",
      header: "Adoption Rate",
      render: (row: any) => <span className="font-mono text-sm">{row.adoptionRate}%</span>,
    },
    {
      key: "avgResponseTime",
      header: "Avg Latency",
      render: (row: any) => <span className="font-mono text-sm">{row.avgResponseTime} ms</span>,
    },
    {
      key: "errorRate",
      header: "Error Rate",
      render: (row: any) => <span className="font-mono text-sm text-red-600">{row.errorRate}%</span>,
    },
    {
      key: "successRate",
      header: "Success Rate",
      render: (row: any) => <span className="font-mono text-sm text-green-600 font-bold">{row.successRate}%</span>,
    },
    {
      key: "userSatisfaction",
      header: "Satisfaction Score",
      render: (row: any) => (
        <span className="flex items-center gap-1 text-sm font-semibold text-amber-600">
          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          {row.userSatisfaction} / 5.0
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Metric Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="AI Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Target threshold: >98%"
          icon={<Cpu className="h-4 w-4 text-slate-500" />}
          trend={{ value: "Excellent", direction: "neutral" }}
        />
        <StatCard
          title="Overall Adoption Rate"
          value={stats.adoptionRate}
          subtitle="Tenant activation rate"
          icon={<TrendingUp className="h-4 w-4 text-slate-500" />}
          trend={{ value: "+4.1%", direction: "up" }}
        />
        <StatCard
          title="Average Response Time"
          value={`${stats.avgLatency} ms`}
          subtitle="Server-side processing"
          icon={<Star className="h-4 w-4 text-slate-500" />}
          trend={{ value: "-45ms", direction: "down" }}
        />
        <StatCard
          title="Failure Alert Status"
          value={`${stats.failures} errors`}
          subtitle="Last 24 hours logged"
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
          trend={{ value: "-12%", direction: "down" }}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartCard title="Model Performance Comparison (Latency)" description="Average latency in ms by model over time" contentClassName="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Area type="monotone" dataKey="gpt4o" name="GPT-4o" stroke="#0284c7" fillOpacity={0.05} fill="#0284c7" />
              <Area type="monotone" dataKey="claude" name="Claude 3.5" stroke="#f97316" fillOpacity={0.05} fill="#f97316" />
              <Area type="monotone" dataKey="gemini" name="Gemini 1.5" stroke="#a855f7" fillOpacity={0.05} fill="#a855f7" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Satisfaction Score by Feature" description="User feedback ratings normalized out of 5" contentClassName="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockAnalyticsMetrics}>
              <PolarGrid stroke="#e4e4e7" />
              <PolarAngleAxis dataKey="featureName" tick={{ fill: '#4b5563', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar name="Satisfaction Score" dataKey="userSatisfaction" stroke="#a855f7" fill="#a855f7" fillOpacity={0.3} />
              <Tooltip contentStyle={{ fontSize: "12px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Feature Performance Table */}
      <DataTable
        title="Feature Performance Metrics"
        data={mockAnalyticsMetrics}
        columns={columns}
        rowKey={(row) => row.featureName}
        searchable={true}
        searchPlaceholder="Search feature name..."
        searchFields={["featureName"]}
        pageSize={5}
      />
    </div>
  );
}

export default AiAnalytics;
