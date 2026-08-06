import { useState } from "react";
import { useFeatureStore } from "../hooks/useFeatureState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Switch } from "@/shared/components/ui/Switch";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ModuleModal } from "../components/ModuleModal";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Archive } from "lucide-react";
import { toast } from "sonner";
import type { Module } from "../types";

export function ModulesPage() {
  const { modules, updateModule, toggleModuleStatus, archiveModule } = useFeatureStore();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter out archived modules for display
  const activeModules = modules.filter((m) => m.status !== "archived");

  const handleEditClick = (mod: Module) => {
    setEditingModule(mod);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: Omit<Module, "id" | "updatedAt" | "tenantCount">) => {
    if (editingModule) {
      updateModule(editingModule.id, data);
      toast.success(`Successfully updated module: ${data.displayName}`);
    }
  };

  const handleArchiveClick = (mod: Module) => {
    archiveModule(mod.id);
    toast.success(`Module ${mod.displayName} has been archived.`);
  };

  const columns = [
    {
      key: "displayName",
      header: "Module",
      render: (row: Module) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.displayName}</div>
          <div className="text-xs text-slate-400 font-medium max-w-xs truncate">{row.description}</div>
        </div>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (row: Module) => (
        <span className="font-mono text-slate-600 font-bold bg-slate-50 px-2 py-1 rounded-md text-xs border border-slate-100">
          {row.version}
        </span>
      ),
    },
    {
      key: "tenantCount",
      header: "Tenants",
      render: (row: Module) => (
        <span className="text-sm font-semibold text-slate-600">
          {row.tenantCount !== undefined ? row.tenantCount : 0}
        </span>
      ),
    },
    {
      key: "defaultAvailability",
      header: "Default",
      render: (row: Module) => (
        <span className="flex items-center gap-1">
          {row.defaultAvailability === "enabled" ? (
            <StatusBadge variant="success">Auto-enabled</StatusBadge>
          ) : (
            <StatusBadge variant="neutral">Opt-in Required</StatusBadge>
          )}
        </span>
      ),
    },
    {
      key: "status",
      header: "Global Status",
      render: (row: Module) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.status === "active"}
            onCheckedChange={() => {
              toggleModuleStatus(row.id);
              toast.success(
                `Module ${row.displayName} is now ${row.status === "active" ? "inactive" : "active"}`
              );
            }}
          />
          <span className="text-xs font-bold text-slate-500 capitalize">{row.status}</span>
        </div>
      ),
    },
    {
      key: "assignedPlans",
      header: "Assigned Plans",
      render: (row: Module) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.assignedPlans && row.assignedPlans.length > 0 ? (
            row.assignedPlans.map((p) => (
              <span
                key={p}
                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-slate-150"
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (row: Module) => <span className="text-xs text-slate-500 font-medium">{row.updatedAt}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: Module) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
            onClick={() => handleEditClick(row)}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 border-red-100 cursor-pointer"
            onClick={() => handleArchiveClick(row)}
          >
            <Archive className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={activeModules}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search modules..."
        searchFields={["name", "displayName", "category"]}
      />

      <ModuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingModule(null);
        }}
        onSubmit={handleModalSubmit}
        modules={modules}
        editingModule={editingModule}
      />
    </div>
  );
}
export default ModulesPage;
