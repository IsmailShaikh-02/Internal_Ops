import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { mockUsers, type TenantUser } from "../data/mockTabDetails";
import { type Tenant } from "../data/mockTenants";

interface UsersTabProps {
  tenant: Tenant;
}

export default function UsersTab({ tenant }: UsersTabProps) {
  const users = mockUsers[tenant.id] || [
    {
      id: "default",
      name: tenant.owner.name,
      email: tenant.owner.email,
      role: "Owner",
      status: "Active",
      joinedDate: tenant.createdDate,
    },
  ];

  const columns = [
    {
      key: "name",
      header: "User",
      render: (row: TenantUser) => (
        <div>
          <div className="font-semibold text-slate-900">{row.name}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row: TenantUser) => (
        <span className="text-slate-700 font-medium text-sm">{row.role}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: TenantUser) => {
        const variant =
          row.status === "Active"
            ? "success"
            : row.status === "Invited"
            ? "info"
            : "critical";
        return (
          <StatusBadge variant={variant} className="font-medium">
            {row.status}
          </StatusBadge>
        );
      },
    },
    {
      key: "joinedDate",
      header: "Joined Date",
      className: "text-slate-700 text-sm",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-bold text-slate-900">Users</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage user access for this tenant organization.</p>
        </div>
        <Button className="gap-2 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer">
          <Plus className="h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <DataTable<TenantUser>
          data={users}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search users..."
          searchFields={["name", "email", "role"]}
          // selectable
        />
      </div>
    </div>
  );
}
