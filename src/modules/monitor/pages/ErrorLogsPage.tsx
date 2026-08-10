// src/modules/monitor/pages/ErrorLogsPage.tsx

import { useState, useMemo } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { errorLogsMock } from "../data/mockData";
import { type LogEntry } from "../types";
import { toast } from "sonner";
import { AlertCircle, Filter } from "lucide-react";

export default function ErrorLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(errorLogsMock);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const modulesList = useMemo(() => {
    return ["ALL", ...new Set(logs.map((log) => log.module))];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSev = selectedSeverity === "ALL" || log.severity === selectedSeverity.toLowerCase();
      const matchesMod = selectedModule === "ALL" || log.module === selectedModule;
      return matchesSev && matchesMod;
    });
  }, [logs, selectedSeverity, selectedModule]);

  const handleResolveLog = (logId: string) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.id === logId ? { ...log, status: log.status === "resolved" ? "unresolved" : "resolved" } : log
      )
    );
    const updatedLog = logs.find((l) => l.id === logId);
    toast.success(`Error state marked as ${updatedLog?.status === "resolved" ? "unresolved" : "resolved"}`);
  };

  const columns = [
    {
      key: "id",
      header: "Error ID",
      render: (row: LogEntry) => <code className="text-xs font-mono">{row.id}</code>,
    },
    {
      key: "severity",
      header: "Severity",
      render: (row: LogEntry) => {
        const variant = row.severity === "error" ? "critical" : "warning";
        return <StatusBadge variant={variant}>{row.severity}</StatusBadge>;
      },
    },
    {
      key: "module",
      header: "Module",
    },
    {
      key: "message",
      header: "Error Message",
      render: (row: LogEntry) => (
        <span className="font-semibold text-red-700 text-xs block max-w-sm truncate" title={row.message}>
          {row.message}
        </span>
      ),
    },
    {
      key: "timestamp",
      header: "Timestamp",
    },
    {
      key: "status",
      header: "Status",
      render: (row: LogEntry) => {
        const isResolved = row.status === "resolved";
        return (
          <StatusBadge variant={isResolved ? "success" : "neutral"}>
            {isResolved ? "Resolved" : "Unresolved"}
          </StatusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: LogEntry) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedLog(row)}>
            Stack Trace
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResolveLog(row.id)}
          >
            {row.status === "resolved" ? "Reopen" : "Resolve"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* Filter Section */}
        <div className="flex flex-wrap gap-4 p-4 border rounded-xl bg-card shadow-sm items-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Severity</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="border rounded px-2.5 py-1.5 text-xs bg-white w-32 cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="ERROR">Error</option>
                <option value="WARNING">Warning</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Module</span>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border rounded px-2.5 py-1.5 text-xs bg-white w-40 cursor-pointer"
              >
                {modulesList.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod === "ALL" ? "All Modules" : mod}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <DataTable
          title="Aggregated Production Errors"
          data={filteredLogs}
          columns={columns}
          rowKey={(row) => row.id}
        />

        {/* Stack Trace Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-lg text-slate-800">Stack Trace Inspector</h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-500">Error:</span>
                  <span className="ml-1 text-slate-800">{selectedLog.message}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Module:</span>
                  <span className="ml-1 font-semibold text-slate-700">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500">Timestamp:</span>
                  <span className="ml-1 text-slate-600">{selectedLog.timestamp}</span>
                </div>
              </div>

              {selectedLog.stackTrace && (
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed border border-slate-950">
                  {selectedLog.stackTrace}
                </pre>
              )}

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" onClick={() => setSelectedLog(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedLog.stackTrace || "");
                    toast.success("Stack trace copied to clipboard");
                  }}
                >
                  Copy Stack Trace
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MonitoringLayout>
  );
}
