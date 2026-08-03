import { useBillingStore } from "../hooks/useBillingState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Coupon } from "../types";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export function CouponsPage() {
  const { coupons } = useBillingStore();

  const columns = [
    {
      key: "code",
      header: "Coupon Code",
      render: (row: Coupon) => (
        <span className="font-bold text-slate-800 tracking-wider font-mono">{row.code}</span>
      ),
    },
    {
      key: "discount",
      header: "Discount Value",
      render: (row: Coupon) => {
        if (row.discountType === "percentage") {
          return <span className="font-semibold text-slate-700">{row.discountValue}% off</span>;
        }
        return <span className="font-semibold text-slate-700">${row.discountValue} off</span>;
      },
    },
    {
      key: "duration",
      header: "Duration",
      render: (row: Coupon) => {
        if (row.duration === "once") return <span>Once</span>;
        if (row.duration === "forever") return <span>Forever</span>;
        return <span>Repeating ({row.durationMonths} months)</span>;
      },
    },
    {
      key: "redeemedCount",
      header: "Redeemed Count",
      render: (row: Coupon) => <span>{row.redeemedCount.toLocaleString()} times</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Coupon) => (
        <StatusBadge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "Active" : "Expired"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: Coupon) => (
        <div className="flex justify-end pr-2">
          <button
            onClick={() => {
              // Simulated delete coupon
              useBillingStore.setState((state) => ({
                coupons: state.coupons.filter((c) => c.id !== row.id),
              }));
              toast.success(`Coupon ${row.code} removed successfully.`);
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Discount Coupons Catalog</h3>
        <p className="text-xs text-slate-500 font-medium">Manage promotional discount codes and track their redemptions.</p>
      </div>

      <DataTable
        data={coupons}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Search coupons..."
        searchFields={["code"]}
        selectable
      />
    </div>
  );
}
export default CouponsPage;
