// src/modules/security/pages/FailedLoginsPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockFailedLogins } from "../data/mockData";
import type { FailedLoginRecord } from "../types";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

export function FailedLoginsPage() {
  const [failedAttempts, setFailedAttempts] = useState<FailedLoginRecord[]>(mockFailedLogins);

  const handleUnlock = (id: string, name: string) => {
    setFailedAttempts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "active" as const } : item))
    );
    toast.success(`Successfully unlocked operator account: ${name}`);
  };

  const handleBlockIP = (ip: string) => {
    toast.success(`IP address ${ip} has been added to the system-wide blacklist.`);
  };

  const handleInvestigate = (id: string) => {
    setFailedAttempts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "investigating" as const } : item))
    );
    toast.info(`Marked threat attempt as 'Under Active Investigation'`);
  };

  const columns = [
    {
      key: "userName",
      header: "User Scope",
      render: (row: FailedLoginRecord) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.userName}</span>
          <span className="text-[10px] text-slate-400">{row.email}</span>
        </div>
      )
    },
    {
      key: "ipAddress",
      header: "Threat Location",
      render: (row: FailedLoginRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.ipAddress}</span>
          <span className="text-[10px] text-slate-400">{row.device}</span>
        </div>
      )
    },
    {
      key: "failureReason",
      header: "Failure Reason",
      render: (row: FailedLoginRecord) => (
        <span className="text-xs text-rose-650 font-bold bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
          {row.failureReason}
        </span>
      )
    },
    {
      key: "attemptCount",
      header: "Failed Attempts",
      render: (row: FailedLoginRecord) => (
        <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {row.attemptCount}
        </span>
      )
    },
    {
      key: "dateTime",
      header: "Timestamp",
      render: (row: FailedLoginRecord) => (
        <span className="text-slate-500 font-medium text-xs">{row.dateTime}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (row: FailedLoginRecord) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.status === "locked"
              ? "bg-rose-100 text-rose-700 border border-rose-250"
              : row.status === "investigating"
              ? "bg-amber-100 text-amber-700 border border-amber-250"
              : "bg-emerald-100 text-emerald-700 border border-emerald-250"
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Threat Response Actions",
      render: (row: FailedLoginRecord) => (
        <div className="flex items-center gap-1.5">
          {row.status === "locked" && (
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] px-2 py-1 font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-750 border border-emerald-200"
              onClick={() => handleUnlock(row.id, row.userName)}
            >
              Unlock
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="text-[10px] px-2 py-1 font-bold bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200"
            onClick={() => handleBlockIP(row.ipAddress)}
          >
            Block IP
          </Button>
          {row.status !== "investigating" && (
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] px-2 py-1 font-bold border-slate-200 text-slate-600"
              onClick={() => handleInvestigate(row.id)}
            >
              Investigate
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <DataTable
      title="Failed Authentication & Lockouts"
      data={failedAttempts}
      columns={columns}
      rowKey={(row) => row.id}
      searchable
      searchPlaceholder="Search failed attempts..."
      searchFields={["userName", "email", "ipAddress", "failureReason"]}
    />
  );
}

export default FailedLoginsPage;
