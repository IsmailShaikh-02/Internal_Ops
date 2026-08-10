// src/modules/monitor/pages/SchedulerPage.tsx

import React, { useState } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { scheduledJobsMock } from "../data/mockData";
import { type ScheduledJob } from "../types";
import { toast } from "sonner";
import { Calendar, Play, Pause, AlertCircle } from "lucide-react";

export default function SchedulerPage() {
  const [jobs, setJobs] = useState<ScheduledJob[]>(scheduledJobsMock);

  const handleRunNow = (jobId: string, jobName: string) => {
    toast.info(`Manual trigger sent for scheduled task '${jobName}'`);
    
    // Set status to running momentarily
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "running",
              lastExecution: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : job
      )
    );

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "active" } : job
        )
      );
      toast.success(`Scheduled task '${jobName}' completed execution.`);
    }, 2500);
  };

  const handlePauseResume = (jobId: string, jobName: string, currentStatus: "active" | "paused" | "running") => {
    const nextStatus = currentStatus === "paused" ? "active" : "paused";
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: nextStatus } : job))
    );
    toast.success(`Task '${jobName}' schedule ${nextStatus === "paused" ? "paused" : "resumed"}`);
  };

  const columns = [
    {
      key: "name",
      header: "Job Name",
      render: (row: ScheduledJob) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "schedule",
      header: "Cron Expression",
      render: (row: ScheduledJob) => (
        <code className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-700 font-mono">
          {row.schedule}
        </code>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: ScheduledJob) => {
        const variant =
          row.status === "active"
            ? "success"
            : row.status === "running"
            ? "info"
            : "warning";
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "lastExecution",
      header: "Last Execution",
    },
    {
      key: "nextExecution",
      header: "Next Execution",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: ScheduledJob) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={row.status === "running"}
            onClick={() => handleRunNow(row.id, row.name)}
          >
            Run Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={row.status === "running"}
            onClick={() => handlePauseResume(row.id, row.name, row.status)}
          >
            {row.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        <DataTable
          title="Scheduled Cron Tasks"
          data={jobs}
          columns={columns}
          rowKey={(row) => row.id}
        />
      </div>
    </MonitoringLayout>
  );
}
