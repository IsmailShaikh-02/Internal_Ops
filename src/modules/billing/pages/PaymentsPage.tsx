import { useBillingStore } from "../hooks/useBillingState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Payment } from "../types";

export function PaymentsPage() {
  const { payments } = useBillingStore();

  const columns = [
    {
      key: "id",
      header: "Transaction ID",
      render: (row: Payment) => (
        <span className="font-bold text-slate-800 font-mono text-xs">{row.id}</span>
      ),
    },
    {
      key: "invoiceNumber",
      header: "Invoice Reference",
      render: (row: Payment) => (
        <span className="font-semibold text-slate-500 font-mono text-xs">{row.invoiceNumber}</span>
      ),
    },
    {
      key: "tenantName",
      header: "Customer Tenant",
      render: (row: Payment) => <span className="font-semibold text-slate-700">{row.tenantName}</span>,
    },
    {
      key: "amount",
      header: "Amount Paid",
      render: (row: Payment) => <span className="font-bold text-slate-900">${row.amount.toLocaleString()}</span>,
    },
    {
      key: "method",
      header: "Payment Method",
      render: (row: Payment) => <span className="text-slate-600 font-medium">{row.method}</span>,
    },
    {
      key: "createdDate",
      header: "Payment Date",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Payment) => {
        let statusVariant: "success" | "warning" | "critical" | "info" | "neutral" = "success";
        if (row.status === "failed") statusVariant = "critical";
        if (row.status === "processing") statusVariant = "warning";

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
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Payment Transactions</h3>
        <p className="text-xs text-slate-500 font-medium">Log of all processed payment transactions and bank payouts.</p>
      </div>

      <DataTable
        data={payments}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search payments..."
        searchFields={["tenantName", "invoiceNumber"]}
        // selectable
      />
    </div>
  );
}
export default PaymentsPage;
