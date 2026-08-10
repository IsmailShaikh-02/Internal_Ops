// src/modules/monitor/pages/ApplicationLogsPage.tsx

import React, { useState, useMemo } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { applicationLogsMock } from "../data/mockData";
import { type LogEntry } from "../types";
import { toast } from "sonner";
import { Search, Download, Filter } from "lucide-react";

export default function ApplicationLogsPage() {
  const [logs] = useState<LogEntry[]>(applicationLogsMock);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");

  const modulesList = useMemo(() => {
    return ["ALL", ...new Set(logs.map((log) => log.module))];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.module.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = selectedModule === "ALL" || log.module === selectedModule;
      return matchesSearch && matchesModule;
    });
  }, [logs, searchQuery, selectedModule]);

  const handleDownloadLogs = () => {
    toast.success("Preparing historical application logs export. Your download will start shortly.");
  };

  const columns = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row: LogEntry) => <span className="font-mono text-slate-500">{row.timestamp}</span>,
    },
    {
      key: "severity",
      header: "Level",
      render: (row: LogEntry) => {
        const variant =
          row.severity === "error"
            ? "critical"
            : row.severity === "warning"
            ? "warning"
            : row.severity === "debug"
            ? "neutral"
            : "info";
        return <StatusBadge variant={variant}>{row.severity}</StatusBadge>;
      },
    },
    {
      key: "module",
      header: "Module",
      render: (row: LogEntry) => <span className="font-semibold text-slate-700">{row.module}</span>,
    },
    {
      key: "message",
      header: "Log Message",
      render: (row: LogEntry) => (
        <span className="text-slate-600 font-mono text-xs max-w-lg block truncate" title={row.message}>
          {row.message}
        </span>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search log messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border rounded-lg text-xs w-full bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border rounded px-2.5 py-1.5 text-xs bg-white cursor-pointer w-44"
              >
                <option value="ALL">All Log Domains</option>
                {modulesList.filter((m) => m !== "ALL").map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button variant="outline" onClick={handleDownloadLogs}>
            <Download className="mr-2 h-4 w-4" /> Download Logs
          </Button>
        </div>

        <DataTable
          title="Application Action Trail"
          data={filteredLogs}
          columns={columns}
          rowKey={(row) => row.id}
        />
      </div>
    </MonitoringLayout>
  );
}
