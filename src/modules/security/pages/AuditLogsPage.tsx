// src/modules/security/pages/AuditLogsPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockAuditLogs } from "../data/mockData";
import type { AuditLogRecord } from "../types";

export function AuditLogsPage() {
  const [logs] = useState<AuditLogRecord[]>(mockAuditLogs);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");

  const filteredLogs = logs.filter((log) => {
    if (severityFilter !== "All" && log.severity !== severityFilter.toLowerCase()) return false;
    if (moduleFilter !== "All" && log.module !== moduleFilter) return false;
    return true;
  });

  const columns = [
    {
      key: "user",
      header: "Operator",
      render: (row: AuditLogRecord) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.user}</span>
          <span className="text-[10px] text-slate-400">{row.ipAddress}</span>
        </div>
      )
    },
    {
      key: "action",
      header: "Action / Module",
      render: (row: AuditLogRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.action}</span>
          <span className="text-[10px] font-bold text-slate-450 uppercase">{row.module}</span>
        </div>
      )
    },
    {
      key: "timestamp",
      header: "Date & Time",
      render: (row: AuditLogRecord) => (
        <span className="text-slate-500 font-medium text-xs">{row.timestamp}</span>
      )
    },
    {
      key: "severity",
      header: "Severity",
      render: (row: AuditLogRecord) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.severity === "critical"
              ? "bg-rose-100 text-rose-700 border border-rose-250 animate-pulse"
              : row.severity === "high"
              ? "bg-amber-100 text-amber-700 border border-amber-250"
              : row.severity === "medium"
              ? "bg-blue-100 text-blue-700 border border-blue-250"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {row.severity}
        </span>
      )
    },
    {
      key: "values",
      header: "Audit Difference Values (Previous vs. New)",
      render: (row: AuditLogRecord) => (
        <div className="flex flex-col gap-1 p-2 bg-slate-50 border border-slate-100 rounded-lg max-w-sm">
          {row.previousValue && (
            <div className="flex items-center gap-1.5 text-[10px] text-rose-600 bg-rose-50/50 px-1.5 py-0.5 rounded border border-rose-100/50">
              <span className="font-extrabold">-</span>
              <span className="font-mono">{row.previousValue}</span>
            </div>
          )}
          {row.newValue && (
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50/50 px-1.5 py-0.5 rounded border border-emerald-100/50">
              <span className="font-extrabold">+</span>
              <span className="font-mono">{row.newValue}</span>
            </div>
          )}
          {!row.previousValue && !row.newValue && (
            <span className="text-[10px] text-slate-400 italic">No value modifications recorded</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-slate-250/60 shadow-2xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity Filter</label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-750 focus:outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module Scope Filter</label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-755 focus:outline-none"
          >
            <option value="All">All Modules</option>
            <option value="Security Policies">Security Policies</option>
            <option value="Active Sessions">Active Sessions</option>
            <option value="Blocked IPs">Blocked IPs</option>
            <option value="MFA Settings">MFA Settings</option>
          </select>
        </div>
      </div>

      <DataTable
        title="Immutable Platform Audit Ledger"
        data={filteredLogs}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search audit trails..."
        searchFields={["user", "action", "module", "previousValue", "newValue"]}
      />
    </div>
  );
}

export default AuditLogsPage;
