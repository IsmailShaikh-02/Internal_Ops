import { useBillingStore } from "../hooks/useBillingState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Refund } from "../types";

export function RefundsPage() {
  const { refunds } = useBillingStore();

  const columns = [
    {
      key: "id",
      header: "Refund ID",
      render: (row: Refund) => (
        <span className="font-bold text-slate-800 font-mono text-xs">{row.id}</span>
      ),
    },
    {
      key: "paymentId",
      header: "Payment Reference",
      render: (row: Refund) => (
        <span className="font-semibold text-slate-500 font-mono text-xs">{row.paymentId}</span>
      ),
    },
    {
      key: "tenantName",
      header: "Customer Tenant",
      render: (row: Refund) => <span className="font-semibold text-slate-700">{row.tenantName}</span>,
    },
    {
      key: "amount",
      header: "Refunded Amount",
      render: (row: Refund) => <span className="font-bold text-red-600">-${row.amount.toLocaleString()}</span>,
    },
    {
      key: "reason",
      header: "Refund Reason",
      render: (row: Refund) => <span className="text-slate-500 font-semibold text-xs line-clamp-1">{row.reason}</span>,
    },
    {
      key: "createdDate",
      header: "Refunded Date",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Refund) => {
        let statusVariant: "success" | "warning" | "critical" | "info" | "neutral" = "success";
        if (row.status === "failed") statusVariant = "critical";
        if (row.status === "pending") statusVariant = "warning";

        return (
          <StatusBadge variant={statusVariant}>
            {row.status.toUpperCase()}
          </StatusBadge>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Refund Logs</h3>
        <p className="text-xs text-slate-500 font-medium">Log of issued transaction refunds and adjustment vouchers.</p>
      </div>

      <DataTable
        data={refunds}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search refunds..."
        searchFields={["tenantName", "paymentId"]}
        selectable
      />
    </div>
  );
}
export default RefundsPage;
