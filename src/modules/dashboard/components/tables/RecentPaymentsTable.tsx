import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { RecentPaymentItem } from "../../types";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Building2 } from "lucide-react";

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "succeeded":
      return "success";
    case "refunded":
      return "neutral";
    case "failed":
      return "critical";
    default:
      return "neutral";
  }
};

interface RecentPaymentsTableProps {
  data: RecentPaymentItem[];
}

export function RecentPaymentsTable({
  data,
}: RecentPaymentsTableProps) {

  return (

  <DataTable<RecentPaymentItem>
  title="Recent Payments"
  data={data}
  rowKey={(row) => row.id}
  pageSize={6} // Explicitly set to 6
  searchable
  selectable
  searchFields={["tenant", "method", "status"]}
  columns={[
    {
      key: "tenant",
      header: "Tenant",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4" />
          {row.tenant}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => `$${row.amount}`,
    },
    {
      key: "method",
      header: "Method",
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
      key: "date",
      header: "Date",
      className: "text-right",
    },
  ]}
/>);
}
