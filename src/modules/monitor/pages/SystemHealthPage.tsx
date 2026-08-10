// src/modules/monitor/pages/SystemHealthPage.tsx

import { MonitoringLayout } from "../components/MonitoringLayout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { MetricChart } from "../components/MetricChart";
import {
  systemHealthKPIs,
  monitoredComponents,
  requestsTrend,
  latencyTrend,
  errorsTrend,
  queueTrend
} from "../data/mockData";
import { Activity, ShieldAlert, Cpu, Terminal } from "lucide-react";

export default function SystemHealthPage() {
  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Uptime (30d)"
            value={`${systemHealthKPIs.uptime}%`}
            subtitle="SLO 99.95%"
            icon={<Activity className="h-4 w-4 text-slate-500" />}
            trend={{ value: "Steady", direction: "neutral" }}
          />
          <StatCard
            title="API P99 Latency"
            value="284 ms"
            subtitle="Target < 300ms"
            icon={<Cpu className="h-4 w-4 text-slate-500" />}
            trend={{ value: "+22 ms", direction: "down" }}
          />
          <StatCard
            title="Error Rate"
            value="0.14%"
            subtitle="Last 24h average"
            icon={<ShieldAlert className="h-4 w-4 text-slate-500" />}
            trend={{ value: "-0.05%", direction: "up" }}
          />
          <StatCard
            title="Active Workers"
            value="184 / 200"
            subtitle="BullMQ Cluster"
            icon={<Terminal className="h-4 w-4 text-slate-500" />}
            trend={{ value: "92% capacity", direction: "neutral" }}
          />
        </div>

        {/* Resources Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">System CPU</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{systemHealthKPIs.cpuUsage}%</span>
              <span className="text-xs text-green-600 font-semibold">Healthy</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${systemHealthKPIs.cpuUsage}%` }} />
            </div>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">System Memory</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{systemHealthKPIs.memoryUsage}%</span>
              <span className="text-xs text-amber-600 font-semibold">Moderate</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${systemHealthKPIs.memoryUsage}%` }} />
            </div>
          </div>
          <div className="p-4 border rounded-xl bg-card shadow-sm flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">System Disk</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{systemHealthKPIs.diskUsage}%</span>
              <span className="text-xs text-green-600 font-semibold">Healthy</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: `${systemHealthKPIs.diskUsage}%` }} />
            </div>
          </div>
        </div>

        {/* Charts & Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Requests / sec" description="Aggregate HTTP requests across global edge.">
            <MetricChart type="area" data={requestsTrend} dataKey="value" color="blue" height={180} />
          </ChartCard>

          <ChartCard title="API Latency (ms)" description="Average response latency over last 30 minutes.">
            <MetricChart type="area" data={latencyTrend} dataKey="value" color="emerald" height={180} />
          </ChartCard>

          <ChartCard title="Errors / min" description="HTTP 5xx and uncaught exceptions count.">
            <MetricChart type="area" data={errorsTrend} dataKey="value" color="rose" height={180} />
          </ChartCard>

          <ChartCard title="Queue Depth" description="Total pending jobs in Redis queue.">
            <MetricChart type="area" data={queueTrend} dataKey="value" color="amber" height={180} />
          </ChartCard>
        </div>

        {/* Monitored Components List */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-base">Infrastructure Components Status</h3>
          </div>
          <div className="divide-y">
            {monitoredComponents.map((component) => (
              <div key={component.name} className="px-6 py-3.5 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-sm text-slate-800">{component.name}</span>
                  <span className="text-xs text-muted-foreground">{component.message}</span>
                </div>
                <div className="flex items-center gap-4">
                  {component.latency !== undefined && (
                    <span className="text-xs text-muted-foreground">{component.latency} ms</span>
                  )}
                  <StatusBadge variant={component.status === "up" ? "success" : "critical"}>
                    {component.status === "up" ? "Operational" : "Degraded"}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}
