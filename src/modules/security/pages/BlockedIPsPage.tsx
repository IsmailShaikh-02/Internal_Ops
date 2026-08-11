// src/modules/security/pages/BlockedIPsPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockBlockedIPs } from "../data/mockData";
import type { BlockedIP } from "../types";
import { validateIpAddress } from "../validation";
import { toast } from "sonner";
import { Button } from "@/shared/components/ui/button";

export function BlockedIPsPage() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>(mockBlockedIPs);
  const [newIp, setNewIp] = useState("");
  const [reason, setReason] = useState("");
  const [expiryHours, setExpiryHours] = useState("");

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    if (!validateIpAddress(newIp.trim())) {
      toast.error("Invalid IP Address or CIDR Range format.");
      return;
    }

    const expiryDateString = expiryHours
      ? new Date(Date.now() + Number(expiryHours) * 60 * 60 * 1000)
          .toISOString()
          .replace("T", " ")
          .substring(0, 19)
      : null;

    const newRecord: BlockedIP = {
      id: `block-${Date.now()}`,
      ipAddress: newIp.trim(),
      reason: reason || "Administrative override",
      blockedBy: "Ada Turing (Platform Owner)",
      blockedDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      expiryDate: expiryDateString,
      status: "active"
    };

    setBlockedIPs((prev) => [newRecord, ...prev]);
    setNewIp("");
    setReason("");
    setExpiryHours("");
    toast.success(`Successfully blocked IP address: ${newRecord.ipAddress}`);
  };

  const handleUnblock = (id: string, ip: string) => {
    setBlockedIPs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "expired" as const } : item))
    );
    toast.success(`Unblocked IP address: ${ip}`);
  };

  const columns = [
    {
      key: "ipAddress",
      header: "IP Range / Address",
      render: (row: BlockedIP) => (
        <span className="font-extrabold text-slate-800 text-xs">{row.ipAddress}</span>
      )
    },
    {
      key: "reason",
      header: "Block Reason",
      render: (row: BlockedIP) => (
        <span className="text-slate-600 font-medium text-xs">{row.reason}</span>
      )
    },
    {
      key: "blockedBy",
      header: "Issued By",
      render: (row: BlockedIP) => (
        <span className="text-slate-500 font-semibold text-xs">{row.blockedBy}</span>
      )
    },
    {
      key: "blockedDate",
      header: "Date Issued",
      render: (row: BlockedIP) => (
        <span className="text-slate-450 font-medium text-xs">{row.blockedDate}</span>
      )
    },
    {
      key: "expiryDate",
      header: "Block Expiry",
      render: (row: BlockedIP) => (
        <span className="text-slate-500 font-medium text-xs">{row.expiryDate || "Permanent (Manual Release Only)"}</span>
      )
    },
    {
      key: "status",
      header: "Status",
      render: (row: BlockedIP) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.status === "active"
              ? "bg-rose-100 text-rose-700 border border-rose-250"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: "actions",
      header: "Remediation Controls",
      render: (row: BlockedIP) => (
        <div className="flex items-center gap-1.5">
          {row.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              className="text-[10px] px-2 py-1 font-bold bg-slate-50 hover:bg-slate-100 text-slate-750 border border-slate-200"
              onClick={() => handleUnblock(row.id, row.ipAddress)}
            >
              Unblock
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Block IP Form */}
      <form onSubmit={handleAddBlock} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
          New Firewall IP Perimeter Block
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address / CIDR Block</label>
            <input
              type="text"
              placeholder="e.g. 198.51.100.72"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-750 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Block</label>
            <input
              type="text"
              placeholder="e.g. Suspicious credential sweeps"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-755 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration (Hours, leave blank for perm)</label>
            <input
              type="number"
              placeholder="e.g. 24"
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-755 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs py-2 px-6 cursor-pointer">
            Enforce IP Block
          </Button>
        </div>
      </form>

      <DataTable
        title="Firewall Blocked IPs Directory"
        data={blockedIPs}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search blocked IP addresses, reason..."
        searchFields={["ipAddress", "reason", "blockedBy"]}
      />
    </div>
  );
}

export default BlockedIPsPage;
