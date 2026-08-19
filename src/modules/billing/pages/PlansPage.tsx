import { useState } from "react";
import { useBillingStore } from "../hooks/useBillingState";
import { PlanCard } from "../components/PlanCard";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { NewPlanModal } from "../components/NewPlanModal";
import type { BillingPlan } from "../types";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

export function PlansPage() {
  const { plans, archivePlan } = useBillingStore();
  const [editingPlan, setEditingPlan] = useState<BillingPlan | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const activePlans = plans.filter((p) => p.status === "active");

  const columns = [
    {
      key: "name",
      header: "Plan",
      render: (row: BillingPlan) => (
        <span className="font-bold text-slate-800">{row.name}</span>
      ),
    },
    {
      key: "price",
      header: "Price / mo",
      render: (row: BillingPlan) => <span>${row.price}</span>,
      sortable:true,
    },
    {
      key: "seats",
      header: "Seats",
      render: (row: BillingPlan) => <span>{row.seats.toLocaleString()}</span>,
      sortable:true,
    },
    {
      key: "storageGb",
      header: "Storage",
      render: (row: BillingPlan) => (
        <span>{row.storageGb >= 1024 ? `${row.storageGb / 1024} TB` : `${row.storageGb} GB`}</span>
      ),
    },
    {
      key: "featuresCount",
      header: "Features",
    },
    {
      key: "subscribersCount",
      header: "Subscribers",
      render: (row: BillingPlan) => <span>{row.subscribersCount.toLocaleString()}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row: BillingPlan) => (
        <StatusBadge variant={row.status === "active" ? "success" : "neutral"}>
          {row.status === "active" ? "Active" : "Archived"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row: BillingPlan) => (
        <div className="flex justify-end pr-2">
          <button
            onClick={() => {
              if (row.status === "active") {
                setEditingPlan(row);
                setIsEditOpen(true);
              }
            }}
            disabled={row.status === "archived"}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>
      ),
    },
  ];

  const handleArchive = (id: string) => {
    archivePlan(id);
    toast.success("Billing plan successfully archived.");
  };

  const handleEditSubmit = (data: Omit<BillingPlan, "id" | "subscribersCount" | "status">) => {
    if (editingPlan) {
      // For simulated editing, we can add it as a new plan or update store.
      // To keep it simple, we can add a custom update handler to useBillingStore.
      // Let's modify useBillingStore to support editing!
      useBillingStore.setState((state) => ({
        plans: state.plans.map((p) =>
          p.id === editingPlan.id ? { ...p, ...data } : p
        ),
      }));
      toast.success(`Successfully updated plan: ${data.name}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Premium Plan Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activePlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onArchive={handleArchive}
            onEdit={(p) => {
              setEditingPlan(p);
              setIsEditOpen(true);
            }}
          />
        ))}
      </div>

      {/* Plan Table View */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">All Catalog Plans</h3>
        </div>
        <DataTable
          data={plans}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search plans..."
          searchFields={["name"]}
          // selectable
        />
      </div>

      {/* Edit Plan Modal container */}
      <NewPlanModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleEditSubmit}
        editingPlan={editingPlan}
      />
    </div>
  );
}
export default PlansPage;
