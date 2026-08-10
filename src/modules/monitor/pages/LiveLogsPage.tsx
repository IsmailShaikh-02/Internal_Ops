// src/modules/monitor/pages/LiveLogsPage.tsx

import React, { useState, useEffect, useRef } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { liveLogsInitial, generateRandomLiveLog } from "../data/mockData";
import { type LogEntry } from "../types";
import { toast } from "sonner";
import { Play, Pause, Trash2, Download, Search, Terminal } from "lucide-react";

export default function LiveLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>(liveLogsInitial);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const logIndexRef = useRef<number>(100);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Streaming interval
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setLogs((prev) => {
        logIndexRef.current += 1;
        const newLog = generateRandomLiveLog(logIndexRef.current);
        const updated = [...prev, newLog];
        // Limit history to last 50 logs
        return updated.slice(-50);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSev = severityFilter === "ALL" || log.severity === severityFilter.toLowerCase();
    return matchesSearch && matchesSev;
  });

  const handleDownload = () => {
    toast.success("Downloading current live log stream buffer.");
  };

  const handleClear = () => {
    setLogs([]);
    toast.success("Terminal buffer cleared.");
  };

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search live stream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border rounded-lg text-xs w-full bg-white"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="border rounded px-2.5 py-1.5 text-xs bg-white cursor-pointer w-36"
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="DEBUG">Debug</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsStreaming(!isStreaming)}
              className={isStreaming ? "border-amber-200 text-amber-700 bg-amber-50" : ""}
            >
              {isStreaming ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause Streaming
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Resume Streaming
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleClear} title="Clear Terminal">
              <Trash2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" onClick={handleDownload} title="Download Buffer">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Terminal Screen */}
        <div className="border rounded-xl shadow-inner bg-slate-950 p-6 flex flex-col gap-2 min-h-[400px] max-h-[500px] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center text-slate-500 border-b border-slate-900 pb-3 mb-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>InternalOps Logging Terminal v1.0.0</span>
            </div>
            <span>Buffer: {filteredLogs.length} items</span>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1.5 font-mono text-[11px] leading-relaxed">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const colors: Record<string, string> = {
                  error: "text-red-400 font-semibold",
                  warning: "text-amber-400 font-semibold",
                  debug: "text-slate-400",
                  info: "text-emerald-400",
                };
                return (
                  <div key={log.id} className="flex gap-2 hover:bg-slate-900/40 p-0.5 rounded transition-all">
                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    <span className={`w-16 shrink-0 font-bold uppercase ${colors[log.severity]}`}>
                      {log.severity}
                    </span>
                    <span className="text-blue-400 shrink-0">[{log.module}]</span>
                    <span className="text-slate-200">{log.message}</span>
                  </div>
                );
              })
            ) : (
              <div className="text-slate-600 text-center py-20">
                No logs matching current filters found in stream.
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </MonitoringLayout>
  );
}
