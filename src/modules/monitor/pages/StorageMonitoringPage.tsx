// src/modules/monitor/pages/StorageMonitoringPage.tsx

import React from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { MetricChart } from "../components/MetricChart";
import { storageMetricsMock } from "../data/mockData";
import { HardDrive, Files, ShieldCheck, HelpCircle } from "lucide-react";

export default function StorageMonitoringPage() {
  const usedPercentage = (storageMetricsMock.usedStorage / storageMetricsMock.totalStorage) * 100;

  // Transform breakdown data into Recharts friendly array
  const pieData = [
    { name: "Documents", value: storageMetricsMock.breakdown.documents },
    { name: "Images", value: storageMetricsMock.breakdown.images },
    { name: "Videos", value: storageMetricsMock.breakdown.videos },
    { name: "Attachments", value: storageMetricsMock.breakdown.attachments },
    { name: "Logs", value: storageMetricsMock.breakdown.logs },
    { name: "Backups", value: storageMetricsMock.breakdown.backups },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Storage"
            value={`${storageMetricsMock.totalStorage} GB`}
            subtitle="S3 Object Store"
            icon={<HardDrive className="h-4 w-4 text-slate-500" />}
          />
          <StatCard
            title="Used Storage"
            value={`${storageMetricsMock.usedStorage} GB`}
            subtitle={`${usedPercentage.toFixed(1)}% capacity used`}
            icon={<HardDrive className="h-4 w-4 text-blue-500" />}
            trend={{ value: `${usedPercentage.toFixed(1)}%`, direction: "neutral" }}
          />
          <StatCard
            title="Total File Count"
            value={storageMetricsMock.fileCount.toLocaleString()}
            subtitle="Across all buckets"
            icon={<Files className="h-4 w-4 text-violet-500" />}
          />
          <StatCard
            title="Backup Storage"
            value={`${storageMetricsMock.backupStorage} GB`}
            subtitle="Retention policy: 90 days"
            icon={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
            trend={{ value: "Safe", direction: "up" }}
          />
        </div>

        {/* Storage Bar Gauge */}
        <div className="p-5 border rounded-xl bg-card shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-semibold">
            <span className="text-slate-800">Storage Capacity</span>
            <span className="text-slate-600">
              {storageMetricsMock.usedStorage} GB / {storageMetricsMock.totalStorage} GB ({usedPercentage.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${usedPercentage}%` }} />
          </div>
        </div>

        {/* Distribution charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Storage Distribution (GB)" description="Usage share by individual media types.">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="w-full max-w-[200px]">
                <MetricChart type="pie" data={pieData} dataKey="value" height={200} />
              </div>
              <div className="flex-1 space-y-2 w-full">
                {pieData.map((item, index) => {
                  const colors = ["#2563eb", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#64748b"];
                  const pct = (item.value / storageMetricsMock.usedStorage) * 100;
                  return (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="font-medium text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground font-semibold">
                        {item.value} GB ({pct.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartCard>

          <div className="border rounded-xl bg-card p-6 shadow-sm flex flex-col gap-4">
            <h3 className="font-semibold text-base text-slate-800">Storage Optimization Recommendations</h3>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg bg-amber-50/50 border-amber-200 text-xs flex gap-2">
                <HelpCircle className="h-5 w-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-800">Archival eligible: Logs</h4>
                  <p className="text-amber-700 mt-1">
                    Application logs ({storageMetricsMock.breakdown.logs} GB) have not been accessed in 30 days. You can save 80% on cost by moving them to Glacier Deep Archive.
                  </p>
                </div>
              </div>

              <div className="p-3 border rounded-lg bg-blue-50/50 border-blue-200 text-xs flex gap-2">
                <HelpCircle className="h-5 w-5 text-blue-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-blue-800">Unused Backups cleanup</h4>
                  <p className="text-blue-700 mt-1">
                    There are 4 redundant database snapshots in backup storage that exceed the retention limit of 90 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}
