import { useSupportStore } from "../hooks/useSupportState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { CustomerRequest } from "../types";
import { toast } from "sonner";

export function CustomerRequestsPage() {
  const { customerRequests, updateCustomerRequestStatus, assignCustomerRequestOwner } = useSupportStore();

  const handleStatusChange = (id: string, status: CustomerRequest["status"]) => {
    updateCustomerRequestStatus(id, status);
    toast.success(`Request status set to ${status}`);
  };

  const handleOwnerChange = (id: string, owner: string) => {
    assignCustomerRequestOwner(id, owner);
    toast.success(`Request owner set to ${owner}`);
  };

  const getStatusBadgeVariant = (status: CustomerRequest["status"]) => {
    switch (status) {
      case "completed": return "success";
      case "in_progress": return "warning";
      case "cancelled": return "critical";
      default: return "neutral";
    }
  };

  const columns = [
    {
      key: "type",
      header: "Request Type",
      className: "font-semibold text-slate-800 text-sm",
      render: (row: CustomerRequest) => (
        <span className="capitalize">{row.type.replace("_", " ")}</span>
      ),
    },
    {
      key: "tenant",
      header: "Tenant",
      className: "text-sm font-semibold text-slate-700",
    },
    {
      key: "subject",
      header: "Subject Summary",
      className: "text-sm text-slate-900 max-w-xs truncate",
      render: (row: CustomerRequest) => (
        <div>
          <p className="font-semibold">{row.subject}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{row.details}</p>
        </div>
      ),
    },
    {
      key: "assignedOwner",
      header: "Operations Owner",
      render: (row: CustomerRequest) => (
        <select
          value={row.assignedOwner}
          onChange={(e) => handleOwnerChange(row.id, e.target.value)}
          className="rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white focus:outline-none focus:border-blue-500"
        >
          <option value="Clark Kent">Clark Kent</option>
          <option value="Lois Lane">Lois Lane</option>
          <option value="Bruce Wayne">Bruce Wayne</option>
        </select>
      ),
    },
    {
      key: "createdDate",
      header: "Date Logged",
      className: "text-xs text-slate-500",
    },
    {
      key: "status",
      header: "Status",
      render: (row: CustomerRequest) => (
        <div className="flex items-center gap-2">
          <StatusBadge variant={getStatusBadgeVariant(row.status)}>
            {row.status.toUpperCase()}
          </StatusBadge>

          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        data={customerRequests}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Filter requests by tenant or subject..."
        searchFields={["tenant", "subject", "details"]}
        pageSize={6}
      />
    </div>
  );
}
export default CustomerRequestsPage;
