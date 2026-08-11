// src/modules/security/pages/UserImpersonationPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockImpersonations } from "../data/mockData";
import type { ImpersonationRecord } from "../types";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

export function UserImpersonationPage() {
  const [impersonations, setImpersonations] = useState<ImpersonationRecord[]>(mockImpersonations);
  const [targetUser, setTargetUser] = useState("");
  const [tenant, setTenant] = useState("");
  const [reason, setReason] = useState("");

  const handleStartImpersonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser.trim() || !tenant.trim() || !reason.trim()) return;

    const newRecord: ImpersonationRecord = {
      id: `imp-${Date.now()}`,
      adminUser: "Ada Turing (Platform Owner)",
      targetUser: targetUser.trim(),
      tenant: tenant.trim(),
      startTime: new Date().toISOString().replace("T", " ").substring(0, 19),
      endTime: null,
      reason: reason.trim()
    };

    setImpersonations((prev) => [newRecord, ...prev]);
    setTargetUser("");
    setTenant("");
    setReason("");
    toast.success(`Successfully initialized impersonation session as user: ${newRecord.targetUser}`);
  };

  const handleEndImpersonation = (id: string, name: string) => {
    setImpersonations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              endTime: new Date().toISOString().replace("T", " ").substring(0, 19)
            }
          : item
      )
    );
    toast.info(`Terminated impersonation session for ${name}`);
  };

  const columns = [
    {
      key: "adminUser",
      header: "Administrator User",
      render: (row: ImpersonationRecord) => (
        <span className="font-semibold text-slate-700 text-xs">{row.adminUser}</span>
      )
    },
    {
      key: "targetUser",
      header: "Target Impersonated User",
      render: (row: ImpersonationRecord) => (
        <span className="font-bold text-slate-800 text-xs">{row.targetUser}</span>
      )
    },
    {
      key: "tenant",
      header: "Tenant Scope",
      render: (row: ImpersonationRecord) => (
        <span className="font-semibold text-slate-600 text-xs">{row.tenant}</span>
      )
    },
    {
      key: "reason",
      header: "Reason for Access",
      render: (row: ImpersonationRecord) => (
        <span className="text-slate-500 font-medium text-xs line-clamp-1 max-w-xs">{row.reason}</span>
      )
    },
    {
      key: "startTime",
      header: "Start Time",
      render: (row: ImpersonationRecord) => (
        <span className="text-slate-450 font-semibold text-xs">{row.startTime}</span>
      )
    },
    {
      key: "endTime",
      header: "Session Status",
      render: (row: ImpersonationRecord) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.endTime === null
              ? "bg-amber-100 text-amber-700 border border-amber-250 animate-pulse"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {row.endTime === null ? "Active" : `Closed at ${row.endTime}`}
        </span>
      )
    },
    {
      key: "actions",
      header: "Access Enforcement",
      render: (row: ImpersonationRecord) => (
        <div className="flex items-center gap-1.5">
          {row.endTime === null && (
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] px-2 py-1 font-bold bg-rose-50 hover:bg-rose-100 text-rose-750 border border-rose-200"
              onClick={() => handleEndImpersonation(row.id, row.targetUser)}
            >
              End Session
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Impersonation Initiator Form */}
      <form onSubmit={handleStartImpersonation} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
          Request Support Impersonation Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target User Name / Email</label>
            <input
              type="text"
              placeholder="e.g. Devin Miller"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-750 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant Scope</label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              value={tenant}
              onChange={(e) => setTenant(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-755 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Impersonation Access</label>
            <input
              type="text"
              placeholder="e.g. Debugging billing sync error"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-755 focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs py-2 px-6 cursor-pointer">
            Start Secure Session
          </Button>
        </div>
      </form>

      <DataTable
        title="Administrative Impersonation Audit Logs"
        data={impersonations}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search impersonation logs..."
        searchFields={["adminUser", "targetUser", "tenant", "reason"]}
      />
    </div>
  );
}

export default UserImpersonationPage;
