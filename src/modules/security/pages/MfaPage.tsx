// src/modules/security/pages/MfaPage.tsx

import { useState } from "react";
import { Switch } from "@/shared/components/ui/Switch";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { ShieldCheck, Eye, RefreshCw } from "lucide-react";

interface MfaUserRow {
  id: string;
  user: string;
  email: string;
  status: "Enabled" | "Disabled";
  enabledDate: string | null;
  lastVerification: string | null;
  recoveryStatus: "Generated" | "Not Configured";
}

export function MfaPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mandatoryByRole, setMandatoryByRole] = useState(["owner", "admin"]);
  const [recoveryCodesEnabled, setRecoveryCodesEnabled] = useState(true);
  const [trustedDevicesEnabled, setTrustedDevicesEnabled] = useState(true);
  const [freqDays, setFreqDays] = useState(30);

  const roles = [
    { id: "owner", name: "Platform Owner" },
    { id: "admin", name: "System Administrator" },
    { id: "auditor", name: "Auditor" },
    { id: "support", name: "Support Manager" }
  ];

  const mockMfaUsers: MfaUserRow[] = [
    {
      id: "u-1",
      user: "Ada Turing",
      email: "ada@internalops.com",
      status: "Enabled",
      enabledDate: "2026-01-15 08:30",
      lastVerification: "2026-08-11 11:30",
      recoveryStatus: "Generated"
    },
    {
      id: "u-2",
      user: "Miguel Reyes",
      email: "miguel@internalops.com",
      status: "Enabled",
      enabledDate: "2026-02-10 10:00",
      lastVerification: "2026-08-11 11:15",
      recoveryStatus: "Generated"
    },
    {
      id: "u-3",
      user: "Priya Shah",
      email: "priya@internalops.com",
      status: "Enabled",
      enabledDate: "2026-05-18 14:22",
      lastVerification: "2026-08-11 10:45",
      recoveryStatus: "Generated"
    },
    {
      id: "u-4",
      user: "Jonas Krieger",
      email: "jonas@internalops.com",
      status: "Disabled",
      enabledDate: null,
      lastVerification: null,
      recoveryStatus: "Not Configured"
    }
  ];

  const handleRoleToggle = (roleId: string) => {
    setMandatoryByRole((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("MFA Policy configurations applied successfully.");
  };

  const handleResetMfa = (name: string) => {
    toast.info(`MFA reset email dispatched to ${name}.`);
  };

  const columns = [
    {
      key: "user",
      header: "User Details",
      render: (row: MfaUserRow) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.user}</span>
          <span className="text-[10px] text-slate-400">{row.email}</span>
        </div>
      )
    },
    {
      key: "status",
      header: "MFA Status",
      render: (row: MfaUserRow) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.status === "Enabled"
              ? "bg-emerald-100 text-emerald-700 border border-emerald-250"
              : "bg-slate-100 text-slate-500 border border-slate-200"
          }`}
        >
          {row.status}
        </span>
      )
    },
    {
      key: "enabledDate",
      header: "Enabled Date",
      render: (row: MfaUserRow) => (
        <span className="text-slate-500 font-semibold text-xs">{row.enabledDate || "--"}</span>
      )
    },
    {
      key: "lastVerification",
      header: "Last Verification",
      render: (row: MfaUserRow) => (
        <span className="text-slate-600 font-semibold text-xs">{row.lastVerification || "--"}</span>
      )
    },
    {
      key: "recoveryStatus",
      header: "Recovery Codes",
      render: (row: MfaUserRow) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.recoveryStatus === "Generated"
              ? "bg-blue-100 text-blue-700 border border-blue-250"
              : "bg-amber-100 text-amber-700 border border-amber-250"
          }`}
        >
          {row.recoveryStatus}
        </span>
      )
    },
    {
      key: "actions",
      header: "MFA Actions",
      render: (row: MfaUserRow) => (
        <Button
          variant="outline"
          size="sm"
          className="text-[10px] px-2 py-1 font-bold border-slate-200 text-slate-600 flex items-center gap-1"
          onClick={() => handleResetMfa(row.user)}
        >
          <RefreshCw className="h-3 w-3" />
          Reset MFA
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: MFA Settings Form */}
        <form onSubmit={handleSavePolicy} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Multi-Factor Authentication Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <div>
                <label className="block">Enable Multi-Factor Authentication</label>
                <span className="text-[10px] text-slate-400 font-normal">Enforce globally for console users</span>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <div>
                <label className="block">Allow Recovery & Backup Codes</label>
                <span className="text-[10px] text-slate-400 font-normal">Permits usage of generated backup codes</span>
              </div>
              <Switch checked={recoveryCodesEnabled} onCheckedChange={setRecoveryCodesEnabled} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <div>
                <label className="block">Trust Known Devices</label>
                <span className="text-[10px] text-slate-400 font-normal">Allows users to skip verification on saved sessions</span>
              </div>
              <Switch checked={trustedDevicesEnabled} onCheckedChange={setTrustedDevicesEnabled} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 border-t pt-3">
              <label>Verification Frequency (Days)</label>
              <input
                type="number"
                value={freqDays}
                onChange={(e) => setFreqDays(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs py-2 px-6 cursor-pointer">
              Save Policy Changes
            </Button>
          </div>
        </form>

        {/* Right 1 col: Role Mandatory List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-slate-500" /> Mandatory MFA by Role
          </h3>
          <div className="space-y-3">
            {roles.map((r) => (
              <label key={r.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mandatoryByRole.includes(r.id)}
                  onChange={() => handleRoleToggle(r.id)}
                  className="rounded border-slate-300 text-slate-850 focus:ring-slate-500"
                />
                {r.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <DataTable
        title="Operators MFA Verification Status"
        data={mockMfaUsers}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search operators..."
        searchFields={["user", "email"]}
      />
    </div>
  );
}

export default MfaPage;
