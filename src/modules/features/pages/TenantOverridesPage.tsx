import { useState } from "react";
import { useFeatureStore } from "../hooks/useFeatureState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { TenantOverrideModal } from "../components/TenantOverrideModal";
import { Button } from "@/shared/components/ui/button";
import { Edit2, Trash2, CalendarX } from "lucide-react";
import { toast } from "sonner";
import type { TenantOverride } from "../types";

export function TenantOverridesPage() {
  const { tenantOverrides, featureFlags, addTenantOverride, removeTenantOverride, expireTenantOverride } = useFeatureStore();
  const [editingOverride, setEditingOverride] = useState<TenantOverride | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (override: TenantOverride) => {
    setEditingOverride(override);
    setIsModalOpen(true);
  };

  const handleRemoveClick = (override: TenantOverride) => {
    removeTenantOverride(override.id);
    toast.success(`Removed all overrides for tenant: ${override.tenantName}`);
  };

  const handleExpireClick = (override: TenantOverride) => {
    expireTenantOverride(override.id);
    toast.success(`Manually expired overrides for tenant: ${override.tenantName}`);
  };

  const handleModalSubmit = (data: Omit<TenantOverride, "id">) => {
    if (editingOverride) {
      // Re-add to update
      removeTenantOverride(editingOverride.id);
      addTenantOverride(data);
      toast.success(`Successfully updated overrides for: ${data.tenantName}`);
    }
  };

  const columns = [
    {
      key: "tenantName",
      header: "Tenant Name",
      render: (row: TenantOverride) => (
        <div>
          <div className="font-bold text-slate-800 text-sm">{row.tenantName}</div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Plan: {row.currentPlan}
          </div>
        </div>
      ),
    },
    {
      key: "enabledFeatures",
      header: "Custom Enabled Features",
      render: (row: TenantOverride) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.enabledFeatures.length > 0 ? (
            row.enabledFeatures.map((f) => (
              <span
                key={f}
                className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100"
              >
                +{f}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "disabledFeatures",
      header: "Custom Disabled Features",
      render: (row: TenantOverride) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {row.disabledFeatures.length > 0 ? (
            row.disabledFeatures.map((f) => (
              <span
                key={f}
                className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold border border-rose-100"
              >
                -{f}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">None</span>
          )}
        </div>
      ),
    },
    {
      key: "expiryDate",
      header: "Expiry Date",
      render: (row: TenantOverride) => (
        <span className="text-xs text-slate-600 font-semibold">
          {row.expiryDate ? row.expiryDate : "Never Expires"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: TenantOverride) => (
        <span className="capitalize">
          {row.status === "active" ? (
            <StatusBadge variant="success">Active Override</StatusBadge>
          ) : (
            <StatusBadge variant="neutral">Expired</StatusBadge>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: TenantOverride) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 cursor-pointer"
            onClick={() => handleEditClick(row)}
            title="Edit Override Settings"
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          {row.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 hover:text-amber-800 border-amber-100 cursor-pointer"
              onClick={() => handleExpireClick(row)}
              title="Expire Override"
            >
              <CalendarX className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 border-red-100 cursor-pointer"
            onClick={() => handleRemoveClick(row)}
            title="Remove Override"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={tenantOverrides}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search tenants..."
        searchFields={["tenantName", "currentPlan"]}
      />

      <TenantOverrideModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingOverride(null);
        }}
        onSubmit={handleModalSubmit}
        featureFlags={featureFlags}
        editingOverride={editingOverride}
      />
    </div>
  );
}
export default TenantOverridesPage;
