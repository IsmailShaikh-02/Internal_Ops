import { DataTable } from "@/shared/components/ui/DataTable";
import { mockActivities, type TenantActivity } from "../data/mockTabDetails";
import { type Tenant } from "../data/mockTenants";

interface ActivityTabProps {
  tenant: Tenant;
}

export default function ActivityTab({ tenant }: ActivityTabProps) {
  const activities = mockActivities[tenant.id] || [
    {
      id: "default",
      event: "Tenant profile details accessed",
      user: "System",
      ipAddress: "N/A",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    },
  ];

  const columns = [
    {
      key: "event",
      header: "Activity Event",
      className: "font-medium text-slate-800 text-sm",
    },
    {
      key: "user",
      header: "Triggered By",
      className: "text-slate-700 text-sm",
    },
    {
      key: "ipAddress",
      header: "IP Address",
      className: "text-slate-500 font-mono text-[11px]",
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
        <h3 className="text-base font-bold text-slate-900">Activity Logs</h3>
        <p className="text-xs text-slate-500 mt-0.5">Real-time view of recent operations and system integrations executed inside the tenant workspace.</p>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <DataTable<TenantActivity>
          data={activities}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search activity events..."
          searchFields={["event", "user", "ipAddress"]}
        />
      </div>
    </div>
  );
}
