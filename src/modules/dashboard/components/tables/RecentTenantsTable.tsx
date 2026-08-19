import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Users } from "lucide-react";

interface RecentTenantItem {
  id: number;
  tenant: string;
  plan: string;
  status: string;
  mrr: number;
  users: number;
}

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "trial":
      return "neutral";
    case "inactive":
      return "critical";
    default:
      return "neutral";
  }
};

interface RecentTenantsTableProps {
  data: RecentTenantItem[];
}

export function RecentTenantsTable({ data }: RecentTenantsTableProps) {
  return (
    <DataTable<RecentTenantItem>
      title="Recent Tenants"
      data={data}
      rowKey={(row) => row.id}
      pageSize={6}
      searchable
      // selectable
      searchFields={["tenant", "plan", "status"]}
      columns={[
        {
          key: "tenant",
          header: "Tenant",
          render: (row) => (
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{row.tenant}</span>
            </div>
          ),
        },
        {
          key: "plan",
          header: "Plan",
        },
        {
          key: "status",
          header: "Status",
          render: (row) => (
            <StatusBadge variant={getStatusVariant(row.status)}>
              {row.status}
            </StatusBadge>
          ),
        },
        {
          key: "mrr",
          header: "MRR",
          render: (row) => `$${row.mrr}`,
        },
        {
          key: "users",
          header: "Users",
          className: "text-right",
          headerClassName: "text-right",
          render: (row) => row.users,
        },
      ]}
    />
  );
}