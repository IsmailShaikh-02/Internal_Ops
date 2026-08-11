// src/modules/security/pages/ActiveSessionsPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockActiveSessions } from "../data/mockData";
import type { ActiveSession } from "../types";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

export function ActiveSessionsPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(mockActiveSessions);

  const handleTerminate = (id: string, name: string) => {
    setSessions((prev) => prev.filter((sess) => sess.id !== id));
    toast.success(`Successfully terminated active session for ${name}`);
  };

  const handleViewActivity = (name: string) => {
    toast.info(`Fetching live audit logs for active session: ${name}`);
  };

  const columns = [
    {
      key: "userName",
      header: "Session Owner",
      render: (row: ActiveSession) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.userName}</span>
          <span className="text-[10px] text-slate-400">{row.email}</span>
        </div>
      )
    },
    {
      key: "loginTime",
      header: "Logged In",
      render: (row: ActiveSession) => (
        <span className="text-slate-600 font-semibold text-xs">{row.loginTime}</span>
      )
    },
    {
      key: "lastActivity",
      header: "Last Activity",
      render: (row: ActiveSession) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
          {row.lastActivity}
        </span>
      )
    },
    {
      key: "device",
      header: "Browser & Client Device",
      render: (row: ActiveSession) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.device}</span>
          <span className="text-[10px] text-slate-400">{row.browser}</span>
        </div>
      )
    },
    {
      key: "ipAddress",
      header: "Connected IP Address",
      render: (row: ActiveSession) => (
        <span className="text-slate-600 font-semibold text-xs">{row.ipAddress}</span>
      )
    },
    {
      key: "duration",
      header: "Session Duration",
      render: (row: ActiveSession) => (
        <span className="text-slate-600 font-semibold text-xs">{row.duration}</span>
      )
    },
    {
      key: "actions",
      header: "Session Controls",
      render: (row: ActiveSession) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] px-2 py-1 font-bold bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200"
            onClick={() => handleTerminate(row.id, row.userName)}
          >
            Force Logout
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] px-2 py-1 font-bold border-slate-200 text-slate-600"
            onClick={() => handleViewActivity(row.userName)}
          >
            View Activity
          </Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      title="Concurrent Active Sessions Dashboard"
      data={sessions}
      columns={columns}
      rowKey={(row) => row.id}
      searchable
      searchPlaceholder="Search active sessions..."
      searchFields={["userName", "email", "ipAddress"]}
    />
  );
}

export default ActiveSessionsPage;
