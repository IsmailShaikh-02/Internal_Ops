import { useState } from "react";
import { useFeatureStore } from "../hooks/useFeatureState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Switch } from "@/shared/components/ui/Switch";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { FeatureFlagModal } from "../components/FeatureFlagModal";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Copy, RotateCcw, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { FeatureFlag } from "../types";

export function FeatureFlagsPage() {
  const {
    featureFlags,
    modules,
    updateFeatureFlag,
    toggleFeatureFlagStatus,
    cloneFeatureFlag,
    addFeatureFlag
  } = useFeatureStore();

  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState("all");

  const handleEditClick = (flag: FeatureFlag) => {
    setEditingFlag(flag);
    setIsModalOpen(true);
  };

  const handleCloneClick = (flag: FeatureFlag) => {
    const newName = `${flag.name} - Copy`;
    cloneFeatureFlag(flag.id, newName);
    toast.success(`Successfully cloned feature flag as "${newName}"`);
  };

  const handleRollbackClick = (flag: FeatureFlag) => {
    updateFeatureFlag(flag.id, {
      status: "inactive",
      rolloutPercentage: 0,
      rolloutOption: "everyone",
    });
    toast.success(`Flag "${flag.name}" rolled back and deactivated.`);
  };

  const handleModalSubmit = (data: Omit<FeatureFlag, "id" | "lastUpdated">) => {
    if (editingFlag) {
      updateFeatureFlag(editingFlag.id, data);
      toast.success(`Successfully updated feature flag: ${data.name}`);
    }
  };

  // Filter feature flags by selected module
  const filteredFlags = featureFlags.filter((flag) => {
    if (selectedModuleFilter === "all") return true;
    return flag.moduleName.toLowerCase() === selectedModuleFilter.toLowerCase();
  });

  const columns = [
    {
      key: "name",
      header: "Feature Flag",
      render: (row: FeatureFlag) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.name}</div>
          {row.scheduleDate && (
            <div className="flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-0.5">
              <Calendar className="h-3 w-3" />
              Scheduled: {row.scheduleDate}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "moduleName",
      header: "Module",
      render: (row: FeatureFlag) => (
        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-150">
          {row.moduleName}
        </span>
      ),
    },
    {
      key: "rolloutOption",
      header: "Rollout Strategy",
      render: (row: FeatureFlag) => {
        let label = "Everyone";
        let detail = "";

        switch (row.rolloutOption) {
          case "plan":
            label = "Subscription Tier";
            detail = row.targetPlans.join(", ");
            break;
          case "tenant":
            label = "Target Tenants";
            detail = row.targetTenants.join(", ");
            break;
          case "group":
            label = "User Group";
            detail = row.targetGroups.join(", ");
            break;
          case "percentage":
            label = "Percentage Rollout";
            detail = `${row.rolloutPercentage}% of users`;
            break;
        }

        return (
          <div>
            <div className="text-xs font-bold text-slate-700">{label}</div>
            {detail && <div className="text-[10px] text-slate-400 font-medium truncate max-w-xs">{detail}</div>}
          </div>
        );
      },
    },
    {
      key: "rolloutPercentage",
      header: "Rollout Progress",
      render: (row: FeatureFlag) => {
        const percent = row.rolloutOption === "percentage" ? row.rolloutPercentage : row.status === "active" ? 100 : 0;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
              <div
                className={`h-full ${percent === 100 ? "bg-emerald-500" : percent > 0 ? "bg-blue-500" : "bg-slate-300"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-600">{percent}%</span>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: FeatureFlag) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.status === "active"}
            onCheckedChange={() => {
              toggleFeatureFlagStatus(row.id);
              toast.success(
                `Feature flag ${row.name} is now ${row.status === "active" ? "inactive" : "active"}`
              );
            }}
          />
          <span className="text-xs font-bold text-slate-500 capitalize">{row.status}</span>
        </div>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (row: FeatureFlag) => <span className="text-xs text-slate-500 font-medium">{row.lastUpdated}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: FeatureFlag) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
            onClick={() => handleEditClick(row)}
            title="Edit Flag"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
            onClick={() => handleCloneClick(row)}
            title="Clone Flag"
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 border-red-100 cursor-pointer"
            onClick={() => handleRollbackClick(row)}
            title="Rollback Flag"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Module:</span>
        <select
          value={selectedModuleFilter}
          onChange={(e) => setSelectedModuleFilter(e.target.value)}
          className="text-xs font-semibold rounded-lg border border-slate-200 bg-primary/5 px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m.id} value={m.name}>
              {m.displayName}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        data={filteredFlags}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search feature flags..."
        searchFields={["name", "moduleName"]}
      />

      <FeatureFlagModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFlag(null);
        }}
        onSubmit={handleModalSubmit}
        modules={modules}
        featureFlags={featureFlags}
        editingFlag={editingFlag}
      />
    </div>
  );
}
export default FeatureFlagsPage;
