import { useState } from "react";
import { useBillingStore } from "../hooks/useBillingState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Invoice } from "../types";
import { Download } from "lucide-react";
import { toast } from "sonner";

export function InvoicesPage() {
  const { invoices } = useBillingStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === "all") return true;
    return inv.status === statusFilter;
  });

  const handleDownloadPDF = (invNum: string) => {
    toast.info(`Generating receipt document for invoice ${invNum}...`);
    setTimeout(() => {
      toast.success(`Mock PDF for ${invNum} downloaded!`);
    }, 1000);
  };

  const columns = [
    {
      key: "invoiceNumber",
      header: "Invoice Number",
      render: (row: Invoice) => (
        <span className="font-bold text-slate-800 font-mono tracking-wide">{row.invoiceNumber}</span>
      ),
    },
    {
      key: "tenantName",
      header: "Customer Tenant",
      render: (row: Invoice) => <span className="font-semibold text-slate-700">{row.tenantName}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row: Invoice) => <span className="font-bold text-slate-900">${row.amount.toLocaleString()}</span>,
    },
    {
      key: "createdDate",
      header: "Created Date",
    },
    {
      key: "dueDate",
      header: "Due Date",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Invoice) => {
        let statusVariant: "success" | "warning" | "critical" | "info" | "neutral" = "success";
        if (row.status === "void") statusVariant = "neutral";
        if (row.status === "open") statusVariant = "warning";
        if (row.status === "uncollectible") statusVariant = "critical";

        return (
          <StatusBadge variant={statusVariant}>
            {row.status.toUpperCase()}
          </StatusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (row: Invoice) => (
        <div className="flex justify-end pr-2">
          <button
            onClick={() => handleDownloadPDF(row.invoiceNumber)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Download className="h-3 w-3" />
            PDF
          </button>
        </div>
      ),
    },
  ];

  const filterTabs = [
    { label: "All Invoices", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Open", value: "open" },
    { label: "Void", value: "void" },
  ];

  return (
    <div className="space-y-6">
      {/* Invoice Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Invoice Ledger</h3>
          <p className="text-xs text-slate-500 font-medium">Review customer invoices, pending payments, and receipts.</p>
        </div>

        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start">
          {filterTabs.map((t) => (
            <button
              key={t.value}
              onClick={() => setStatusFilter(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === t.value
                  ? "bg-white text-slate-800 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filteredInvoices}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search invoices..."
        searchFields={["invoiceNumber", "tenantName"]}
        selectable
      />
    </div>
  );
}
export default InvoicesPage;
