import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { mockAuditLogs, type TenantAuditLog } from "../data/mockTabDetails";
import { type Tenant } from "../data/mockTenants";

interface AuditTabProps {
  tenant: Tenant;
}

export default function AuditTab({ tenant }: AuditTabProps) {
  const auditLogs = mockAuditLogs[tenant.id] || [
    {
      id: "default",
      action: "Workspace initialized",
      user: "System Initializer",
      category: "Configuration" as const,
      timestamp: tenant.createdDate + " 12:00:00",
    },
  ];

  const columns = [
    {
      key: "action",
      header: "Action Description",
      className: "font-semibold text-slate-800 text-sm",
    },
    {
      key: "user",
      header: "Performed By",
      className: "text-slate-700 text-sm",
    },
    {
      key: "category",
      header: "Category",
      render: (row: TenantAuditLog) => {
        const variant =
          row.category === "Security"
            ? "critical"
            : row.category === "Access"
            ? "info"
            : "neutral";
        return (
          <StatusBadge variant={variant} className="font-semibold text-[10px]">
            {row.category}
          </StatusBadge>
        );
      },
    },
    {
      key: "timestamp",
      header: "Timestamp",
      className: "text-slate-700 text-sm",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Audit Logs</h3>
        <p className="text-xs text-slate-500 mt-0.5">Immutable record of high-severity actions, access history, and critical changes.</p>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <DataTable<TenantAuditLog>
          data={auditLogs}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search audit actions..."
          searchFields={["action", "user", "category"]}
        />
      </div>
    </div>
  );
}
