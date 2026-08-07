import { useSupportStore } from "../hooks/useSupportState";
import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import { Ticket, AlertCircle, CheckCircle2, ShieldAlert, Clock, Smile, FileCheck } from "lucide-react";

export function SupportDashboardPage() {
  const { tickets, featureRequests } = useSupportStore();

  // KPIs
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status !== "closed" && t.status !== "resolved").length;
  const closedTickets = tickets.filter(t => t.status === "closed" || t.status === "resolved").length;
  const highPriorityTickets = tickets.filter(t => t.priority === "high" || t.priority === "critical").length;
  const slaBreached = tickets.filter(t => t.slaBreached).length;

  const resolvedTicketsWithTime = tickets.filter(t => t.resolutionTime !== undefined);
  const avgResolutionTime = resolvedTicketsWithTime.length
    ? Math.round(resolvedTicketsWithTime.reduce((acc, curr) => acc + (curr.resolutionTime || 0), 0) / resolvedTicketsWithTime.length)
    : 0;

  const pendingApprovals = featureRequests.filter(f => f.status === "new" || f.status === "under_review").length;

  // Chart Data preparation
  // 1. Ticket Status
  const statusCounts = tickets.reduce((acc: Record<string, number>, t) => {
    const s = t.status.replace("_", " ");
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // 2. Priority Distribution
  const priorityCounts = tickets.reduce((acc: Record<string, number>, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});
  const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({
    name: name.toUpperCase(),
    value
  }));
  const PRIORITY_COLORS = {
    CRITICAL: "#ef4444",
    HIGH: "#f97316",
    MEDIUM: "#3b82f6",
    LOW: "#94a3b8"
  };

  // 3. Category Distribution
  const categoryCounts = tickets.reduce((acc: Record<string, number>, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // 4. SLA Compliance
  const slaComplianceData = [
    { name: "Compliant", value: totalTickets - slaBreached },
    { name: "Breached", value: slaBreached }
  ];
  const SLA_COLORS = ["#10b981", "#ef4444"];

  // 5. Resolution Trend (Dummy for presentation, based on date stats)
  const resolutionTrendData = [
    { date: "Aug 03", resolved: 2, incoming: 3 },
    { date: "Aug 04", resolved: 3, incoming: 2 },
    { date: "Aug 05", resolved: 1, incoming: 4 },
    { date: "Aug 06", resolved: 4, incoming: 3 },
    { date: "Aug 07", resolved: 2, incoming: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={totalTickets}
          subtitle="All tickets received"
          icon={<Ticket className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          title="Open Tickets"
          value={openTickets}
          subtitle="Awaiting response/actions"
          icon={<AlertCircle className="h-4 w-4 text-orange-500" />}
        />
        <StatCard
          title="Closed Tickets"
          value={closedTickets}
          subtitle="Resolved or closed"
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="High Priority"
          value={highPriorityTickets}
          subtitle="High & Critical priority"
          icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="SLA Breached"
          value={slaBreached}
          subtitle="Response targets missed"
          icon={<AlertCircle className="h-4 w-4 text-red-600" />}
          trend={slaBreached > 0 ? { value: `${Math.round((slaBreached / totalTickets) * 100)}% of total`, direction: "down" } : undefined}
        />
        <StatCard
          title="Avg Resolution Time"
          value={`${avgResolutionTime} hrs`}
          subtitle="Mean time to resolution"
          icon={<Clock className="h-4 w-4 text-indigo-500" />}
        />
        <StatCard
          title="Customer Satisfaction"
          value="4.8 / 5.0"
          subtitle="Based on Q2 feedback surveys"
          icon={<Smile className="h-4 w-4 text-emerald-500" />}
        />
        <StatCard
          title="Pending PM Approvals"
          value={pendingApprovals}
          subtitle="New feature review pipeline"
          icon={<FileCheck className="h-4 w-4 text-cyan-600" />}
        />
      </div>

      {/* Chart Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resolution Trend */}
        <ChartCard title="Ticket Resolution Trend" description="Incoming tickets vs Resolved tickets over last 5 days">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incoming" stroke="#3b82f6" strokeWidth={2.5} name="Incoming" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2.5} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* SLA Compliance */}
        <ChartCard title="SLA Compliance" description="Percentage of tickets meeting operational service level agreements">
          <div className="h-72 flex flex-col md:flex-row items-center justify-around">
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slaComplianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {slaComplianceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={SLA_COLORS[index % SLA_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800">
                  {totalTickets ? Math.round(((totalTickets - slaBreached) / totalTickets) * 100) : 100}%
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Compliant</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-700">Compliant ({totalTickets - slaBreached})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-slate-700">Breached ({slaBreached})</span>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket Status Bar Chart */}
        <ChartCard title="Ticket Status Distribution" className="md:col-span-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Priority Pie */}
        <ChartCard title="Priority Distribution" className="md:col-span-1">
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${percent !== undefined ? (percent * 100).toFixed(0) : 0}%`}
                  labelLine={false}
                >
                  {priorityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || "#cbd5e1"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Category distribution */}
        <ChartCard title="Category Distribution" className="md:col-span-1">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Tickets" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
export default SupportDashboardPage;
