// src/modules/monitor/pages/RedisMonitoringPage.tsx

import React from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { MetricChart } from "../components/MetricChart";
import { redisMetricsMock, redisTrendData } from "../data/mockData";
import { Database, Zap, Key, Trash } from "lucide-react";

export default function RedisMonitoringPage() {
  const memoryPercentage = (redisMetricsMock.memoryUsage / redisMetricsMock.maxMemory) * 100;

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Redis Connection"
            value="Connected"
            subtitle="Host: 127.0.0.1:6379"
            icon={<Database className="h-4 w-4 text-emerald-500" />}
            trend={{ value: "Online", direction: "up" }}
          />
          <StatCard
            title="Cache Hit Ratio"
            value={`${redisMetricsMock.cacheHitRatio}%`}
            subtitle="Target > 80%"
            icon={<Zap className="h-4 w-4 text-blue-500" />}
            trend={{ value: "Optimal", direction: "up" }}
          />
          <StatCard
            title="Active Caching Keys"
            value={redisMetricsMock.activeKeys.toLocaleString()}
            subtitle="Keys stored in DB 0"
            icon={<Key className="h-4 w-4 text-violet-500" />}
          />
          <StatCard
            title="Evicted Keys"
            value={redisMetricsMock.evictedKeys}
            subtitle="Keys dropped due to maxmemory"
            icon={<Trash className="h-4 w-4 text-amber-500" />}
          />
        </div>

        {/* Memory Details bar */}
        <div className="p-5 border rounded-xl bg-card shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-800">Redis Memory Utilization</span>
            <span className="text-slate-600">
              {redisMetricsMock.memoryUsage} MB / {redisMetricsMock.maxMemory} MB ({memoryPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${memoryPercentage}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">
            Max Memory Policy configured: <code className="bg-slate-100 px-1 py-0.5 rounded">allkeys-lru</code>
          </p>
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Memory Utilization (MB)" description="Redis memory footprint over the last hour.">
            <MetricChart type="area" data={redisTrendData} dataKey="memory" color="blue" height={220} />
          </ChartCard>

          <ChartCard title="Cache Hit Ratio (%)" description="Proportion of successful cache lookups over time.">
            <MetricChart type="line" data={redisTrendData} dataKey="hitRatio" color="emerald" height={220} />
          </ChartCard>
        </div>

        {/* Core Redis Stats Table */}
        <div className="border rounded-xl bg-card shadow-sm">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold text-base">Instance Metadata & Stats</h3>
          </div>
          <div className="divide-y text-sm">
            <div className="px-6 py-3 flex justify-between">
              <span className="font-semibold text-slate-500">Redis Version</span>
              <span className="font-mono text-slate-800">7.2.4</span>
            </div>
            <div className="px-6 py-3 flex justify-between">
              <span className="font-semibold text-slate-500">Uptime</span>
              <span className="text-slate-800">24 days, 11 hours, 42 minutes</span>
            </div>
            <div className="px-6 py-3 flex justify-between">
              <span className="font-semibold text-slate-500">Connected Clients</span>
              <span className="text-slate-800">18 clients active</span>
            </div>
            <div className="px-6 py-3 flex justify-between">
              <span className="font-semibold text-slate-500">Expired Keys (Cumulative)</span>
              <span className="text-slate-800 font-mono">{redisMetricsMock.expiredKeys.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}
