import { useBillingStore } from "../hooks/useBillingState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Subscription } from "../types";
import { toast } from "sonner";

export function SubscriptionsPage() {
  const { subscriptions } = useBillingStore();

  const handleCancelSub = (id: string, name: string) => {
    useBillingStore.setState((state) => ({
      subscriptions: state.subscriptions.map((sub) =>
        sub.id === id ? { ...sub, status: "canceled" as const } : sub
      ),
    }));
    toast.success(`Canceled subscription for ${name}`);
  };

  const columns = [
    {
      key: "tenantName",
      header: "Customer Tenant",
      render: (row: Subscription) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.tenantName}</span>
          <span className="text-[10px] font-semibold text-slate-400 font-mono">{row.tenantId}</span>
        </div>
      ),
    },
    {
      key: "planName",
      header: "Plan Name",
      render: (row: Subscription) => <span className="font-semibold text-slate-700">{row.planName}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      render: (row: Subscription) => <span className="font-bold text-slate-900">${row.amount}/mo</span>,
    },
    {
      key: "currentPeriodStart",
      header: "Current Period",
      render: (row: Subscription) => (
        <span className="text-xs font-medium text-slate-500">
          {row.currentPeriodStart} to {row.currentPeriodEnd}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: Subscription) => {
        let statusVariant: "success" | "warning" | "critical" | "info" | "neutral" = "success";
        if (row.status === "past_due") statusVariant = "critical";
        if (row.status === "canceled") statusVariant = "neutral";
        if (row.status === "trialing") statusVariant = "warning";

        return (
          <StatusBadge variant={statusVariant}>
            {row.status === "active"
              ? "Active"
              : row.status === "past_due"
              ? "Past Due"
              : row.status === "canceled"
              ? "Canceled"
              : "Trialing"}
          </StatusBadge>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (row: Subscription) => (
        <div className="flex justify-end pr-2">
          {row.status === "active" && (
            <button
              onClick={() => handleCancelSub(row.id, row.tenantName)}
              className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100 cursor-pointer"
            >
              Cancel Sub
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Active Customer Subscriptions</h3>
        <p className="text-xs text-slate-500 font-medium">Verify current customer contract limits and subscription lifecycles.</p>
      </div>

      <DataTable
        data={subscriptions}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search by tenant..."
        searchFields={["tenantName", "planName"]}
        // selectable
      />
    </div>
  );
}
export default SubscriptionsPage;
