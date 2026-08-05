// src/modules/users/pages/PermissionsPage.tsx

import { useUserState } from "../hooks/useUserState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { ShieldAlert, ShieldCheck, Key } from "lucide-react";
import type { Permission } from "../types";

export function PermissionsPage() {
  const { permissions } = useUserState();

  const getActionColor = (type: Permission["type"]) => {
    const colors: Record<Permission["type"], string> = {
      View: "text-blue-700 bg-blue-50 border-blue-200",
      Create: "text-green-700 bg-green-50 border-green-200",
      Update: "text-amber-700 bg-amber-50 border-amber-200",
      Delete: "text-rose-700 bg-rose-50 border-rose-200",
      Export: "text-purple-700 bg-purple-50 border-purple-200",
      Approve: "text-indigo-700 bg-indigo-50 border-indigo-200",
      Configure: "text-cyan-700 bg-cyan-50 border-cyan-200",
    };
    return colors[type] || "text-slate-700 bg-slate-50 border-slate-200";
  };

  const columns = [
    {
      key: "code",
      header: "Permission Code",
      render: (row: Permission) => (
        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded border">
          {row.code}
        </span>
      ),
    },
    {
      key: "moduleName",
      header: "Module Context",
      className: "text-xs font-semibold text-indigo-600",
    },
    {
      key: "description",
      header: "Functional Scope",
      className: "text-xs font-semibold text-slate-500",
    },
    {
      key: "type",
      header: "Operation Type",
      render: (row: Permission) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getActionColor(row.type)}`}>
          {row.type}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Key className="h-5 w-5 stroke-2" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Total Capabilities</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{permissions.length}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <ShieldCheck className="h-5 w-5 stroke-2" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Active Modules</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">
              {new Set(permissions.map((p) => p.moduleName)).size} Modules
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <ShieldAlert className="h-5 w-5 stroke-2" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Critical Actions</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">
              {permissions.filter((p) => ["Delete", "Configure", "Approve"].includes(p.type)).length} Actions
            </span>
          </div>
        </div>
      </div>

      {/* Permissions DataTable */}
      <DataTable
        title="Granular System Permissions"
        data={permissions}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search permissions by code, module, description..."
        searchFields={["code", "moduleName", "description", "type"]}
      />
    </div>
  );
}

export default PermissionsPage;
