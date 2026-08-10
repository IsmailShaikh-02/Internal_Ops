// src/modules/monitor/pages/BackgroundJobsPage.tsx

import { useState } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { backgroundJobsMock } from "../data/mockData";
import { type BackgroundJob } from "../types";
import { toast } from "sonner";
import { Terminal, RefreshCw, XCircle, Info, Filter } from "lucide-react";

export default function BackgroundJobsPage() {
  const [jobs, setJobs] = useState<BackgroundJob[]>(backgroundJobsMock);
  const [selectedJob, setSelectedJob] = useState<BackgroundJob | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const handleRetryJob = (jobId: string, jobName: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "processing", retryCount: job.retryCount + 1 } : job
      )
    );
    toast.info(`Retrying job '${jobName}'...`);
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, status: "completed", executionTime: 3200, error: undefined } : job
        )
      );
      toast.success(`Job '${jobName}' completed successfully on retry.`);
    }, 3000);
  };

  const handleCancelJob = (jobId: string, jobName: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "failed", error: "Cancelled by Administrator" } : job
      )
    );
    toast.warning(`Cancelled background job '${jobName}'`);
  };

  const filteredJobs = jobs.filter((job) => {
    if (selectedFilter === "ALL") return true;
    return job.status === selectedFilter.toLowerCase();
  });

  const columns = [
    {
      key: "name",
      header: "Job Name",
      render: (row: BackgroundJob) => (
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "queue",
      header: "Queue",
    },
    {
      key: "status",
      header: "Status",
      render: (row: BackgroundJob) => {
        const variant =
          row.status === "completed"
            ? "success"
            : row.status === "processing"
            ? "info"
            : row.status === "queued"
            ? "neutral"
            : "critical";
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "executionTime",
      header: "Execution Time",
      render: (row: BackgroundJob) => (
        <span>{row.executionTime > 0 ? `${(row.executionTime / 1000).toFixed(2)}s` : "-"}</span>
      ),
    },
    {
      key: "retryCount",
      header: "Retries",
    },
    {
      key: "lastRun",
      header: "Last Run",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: BackgroundJob) => (
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={() => setSelectedJob(row)}>
            Details
          </Button>
          {row.status === "failed" && (
            <Button
              variant="outline"
              size="sm"
              title="Retry Job"
              onClick={() => handleRetryJob(row.id, row.name)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
          {(row.status === "queued" || row.status === "processing") && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              title="Cancel Job"
              onClick={() => handleCancelJob(row.id, row.name)}
            >
              <XCircle className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* Status filtering bar */}
        <div className="flex items-center gap-3 p-4 border rounded-xl bg-card shadow-sm">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-600">Filter status:</span>
          <div className="flex border rounded-lg overflow-hidden bg-slate-50">
            {["ALL", "QUEUED", "PROCESSING", "COMPLETED", "FAILED"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border-r last:border-r-0 ${
                  selectedFilter === status ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          title="Background Job Executions"
          data={filteredJobs}
          columns={columns}
          rowKey={(row) => row.id}
        />

        {/* Selected Job Details Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-800">Job Metadata</h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">ID</span>
                  <span className="font-mono text-slate-800">{selectedJob.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Job Name</span>
                  <span className="font-semibold text-slate-800">{selectedJob.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Target Queue</span>
                  <span className="text-slate-800 font-mono">{selectedJob.queue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Status</span>
                  <StatusBadge
                    variant={
                      selectedJob.status === "completed"
                        ? "success"
                        : selectedJob.status === "processing"
                        ? "info"
                        : selectedJob.status === "queued"
                        ? "neutral"
                        : "critical"
                    }
                  >
                    {selectedJob.status}
                  </StatusBadge>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Last Execution</span>
                  <span className="text-slate-800">{selectedJob.lastRun}</span>
                </div>

                {selectedJob.error && (
                  <div className="mt-3 p-3 border rounded-lg bg-red-50 border-red-200 text-xs flex flex-col gap-1">
                    <span className="font-bold text-red-800">Failure Exception:</span>
                    <span className="text-red-700 font-mono whitespace-pre-wrap">{selectedJob.error}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" onClick={() => setSelectedJob(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MonitoringLayout>
  );
}
