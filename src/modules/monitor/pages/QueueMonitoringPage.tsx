// src/modules/monitor/pages/QueueMonitoringPage.tsx

import { useState } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { StatCard } from "@/shared/components/ui/StatCard";
import { queueInfoMock } from "../data/mockData";
import { type QueueInfo } from "../types";
import { toast } from "sonner";
import { Play, Pause, RotateCcw, Trash2, ListChecks, Activity } from "lucide-react";

export default function QueueMonitoringPage() {
  const [queues, setQueues] = useState<QueueInfo[]>(queueInfoMock);

  const handlePauseResume = (queueName: string, currentStatus: "active" | "paused" | "draining") => {
    const nextStatus = currentStatus === "paused" ? "active" : "paused";
    setQueues((prev) =>
      prev.map((q) => (q.name === queueName ? { ...q, status: nextStatus } : q))
    );
    toast.success(`Queue '${queueName}' ${nextStatus === "paused" ? "paused" : "resumed"}`);
  };

  const handleRetryFailed = (queueName: string) => {
    setQueues((prev) =>
      prev.map((q) => (q.name === queueName ? { ...q, failedJobs: 0, retryCount: q.retryCount + q.failedJobs } : q))
    );
    toast.success(`Retry commands sent for all failed jobs in '${queueName}'`);
  };

  const handleClearQueue = (queueName: string) => {
    if (window.confirm(`Are you sure you want to clear all jobs in queue '${queueName}'?`)) {
      setQueues((prev) =>
        prev.map((q) =>
          q.name === queueName ? { ...q, pendingJobs: 0, processingJobs: 0, failedJobs: 0 } : q
        )
      );
      toast.success(`Cleared all jobs from queue '${queueName}'`);
    }
  };

  // Aggregated states for KPI cards
  const totalPending = queues.reduce((sum, q) => sum + q.pendingJobs, 0);
  const totalProcessing = queues.reduce((sum, q) => sum + q.processingJobs, 0);
  const totalFailed = queues.reduce((sum, q) => sum + q.failedJobs, 0);

  const columns = [
    {
      key: "name",
      header: "Queue Name",
      render: (row: QueueInfo) => (
        <span className="font-semibold text-slate-800">{row.name}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: QueueInfo) => {
        const variant =
          row.status === "active"
            ? "success"
            : row.status === "paused"
            ? "warning"
            : "neutral";
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "pendingJobs",
      header: "Pending",
      render: (row: QueueInfo) => (
        <span className={row.pendingJobs > 50 ? "font-bold text-amber-600" : ""}>
          {row.pendingJobs}
        </span>
      ),
    },
    {
      key: "processingJobs",
      header: "Processing",
      render: (row: QueueInfo) => (
        <span className={row.processingJobs > 0 ? "font-bold text-blue-600" : ""}>
          {row.processingJobs}
        </span>
      ),
    },
    {
      key: "failedJobs",
      header: "Failed",
      render: (row: QueueInfo) => (
        <span className={row.failedJobs > 0 ? "font-bold text-red-600" : ""}>
          {row.failedJobs}
        </span>
      ),
    },
    {
      key: "avgProcessingTime",
      header: "Avg Duration",
      render: (row: QueueInfo) => (
        <span>{row.avgProcessingTime > 0 ? `${(row.avgProcessingTime / 1000).toFixed(2)}s` : "-"}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: QueueInfo) => (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePauseResume(row.name, row.status)}
            title={row.status === "paused" ? "Resume" : "Pause"}
          >
            {row.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={row.failedJobs === 0}
            onClick={() => handleRetryFailed(row.name)}
            title="Retry Failed"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleClearQueue(row.name)}
            title="Clear Queue"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Pending Jobs"
            value={totalPending}
            subtitle="Awaiting cluster resources"
            icon={<ListChecks className="h-4 w-4 text-amber-500" />}
          />
          <StatCard
            title="Active Workers Running"
            value={totalProcessing}
            subtitle="Processing jobs in real-time"
            icon={<Activity className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            title="Failed Queue Jobs"
            value={totalFailed}
            subtitle="Awaiting manual/auto retry"
            icon={<RotateCcw className="h-4 w-4 text-red-500" />}
            trend={totalFailed > 0 ? { value: `${totalFailed} errors`, direction: "down" } : undefined}
          />
        </div>

        <DataTable
          title="Background Queues"
          data={queues}
          columns={columns}
          rowKey={(row) => row.name}
        />
      </div>
    </MonitoringLayout>
  );
}
