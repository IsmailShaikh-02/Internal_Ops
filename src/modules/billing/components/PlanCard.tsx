import type { BillingPlan } from "../types";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";

interface PlanCardProps {
  plan: BillingPlan;
  onEdit?: (plan: BillingPlan) => void;
  onArchive?: (id: string) => void;
}

export function PlanCard({ plan, onEdit, onArchive }: PlanCardProps) {
  const isArchived = plan.status === "archived";

  return (
    <div className={`relative rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${isArchived ? "opacity-60 border-slate-200" : "border-slate-200"}`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{plan.name}</h3>
        <StatusBadge variant={plan.status === "active" ? "success" : "neutral"}>
          {plan.status === "active" ? "Active" : "Archived"}
        </StatusBadge>
      </div>

      {/* Pricing Row */}
      <div className="flex items-baseline mb-6">
        <span className="text-3xl font-extrabold text-slate-900">${plan.price}</span>
        <span className="text-sm text-slate-500 font-semibold ml-1">/ {plan.interval === "month" ? "mo" : "yr"}</span>
      </div>

      {/* Core Limits list */}
      <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
        <li className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{plan.seats.toLocaleString()} seats</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{plan.storageGb >= 1024 ? `${(plan.storageGb / 1024).toFixed(0)} TB` : `${plan.storageGb} GB`} storage</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{plan.featuresCount} features</span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>{plan.subscribersCount.toLocaleString()} subscribers</span>
        </li>
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-auto">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          onClick={() => onEdit?.(plan)}
          disabled={isArchived}
        >
          Edit
        </Button>
        <button
          onClick={() => onArchive?.(plan.id)}
          disabled={isArchived}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
            isArchived
              ? "text-slate-400 cursor-not-allowed"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          Archive
        </button>
      </div>
    </div>
  );
}
