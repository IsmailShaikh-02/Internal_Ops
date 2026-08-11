// src/modules/security/pages/LoginHistoryPage.tsx

import { useState } from "react";
import { DataTable } from "@/shared/components/ui/DataTable";
import { mockLogins } from "../data/mockData";
import type { LoginRecord } from "../types";

export function LoginHistoryPage() {
  const [logins] = useState<LoginRecord[]>(mockLogins);
  const [selectedBrowser, setSelectedBrowser] = useState<string>("All");
  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  const filteredLogins = logins.filter((log) => {
    if (selectedBrowser !== "All" && log.browser !== selectedBrowser) return false;
    if (selectedLocation !== "All" && !log.location.includes(selectedLocation)) return false;
    return true;
  });

  const columns = [
    {
      key: "userName",
      header: "User",
      render: (row: LoginRecord) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.userName}</span>
          <span className="text-[10px] text-slate-400">{row.email}</span>
        </div>
      )
    },
    {
      key: "loginTime",
      header: "Login / Logout",
      render: (row: LoginRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.loginTime}</span>
          <span className="text-[10px] text-slate-400">
            {row.logoutTime ? `Out: ${row.logoutTime}` : "Active Session"}
          </span>
        </div>
      )
    },
    {
      key: "ipAddress",
      header: "IP & Location",
      render: (row: LoginRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.ipAddress}</span>
          <span className="text-[10px] text-slate-400">{row.location}</span>
        </div>
      )
    },
    {
      key: "device",
      header: "Client Specs",
      render: (row: LoginRecord) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-700 text-xs">{row.device} ({row.operatingSystem})</span>
          <span className="text-[10px] text-slate-400">{row.browser}</span>
        </div>
      )
    },
    {
      key: "authMethod",
      header: "Auth Verification",
      render: (row: LoginRecord) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          {row.authMethod}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-slate-250/60 shadow-2xs">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Browser Filter</label>
          <select
            value={selectedBrowser}
            onChange={(e) => setSelectedBrowser(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-750 focus:outline-none"
          >
            <option value="All">All Browsers</option>
            <option value="Safari">Safari</option>
            <option value="Chrome">Chrome</option>
            <option value="Firefox">Firefox</option>
            <option value="Safari Mobile">Safari Mobile</option>
            <option value="Chrome Mobile">Chrome Mobile</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location Filter</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold text-slate-755 focus:outline-none"
          >
            <option value="All">All Locations</option>
            <option value="US">United States (US)</option>
            <option value="DE">Germany (DE)</option>
            <option value="IN">India (IN)</option>
            <option value="AE">United Arab Emirates (AE)</option>
          </select>
        </div>
      </div>

      <DataTable
        title="Successful Login Auditing"
        data={filteredLogins}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search operator name, email, IP..."
        searchFields={["userName", "email", "ipAddress"]}
      />
    </div>
  );
}

export default LoginHistoryPage;
