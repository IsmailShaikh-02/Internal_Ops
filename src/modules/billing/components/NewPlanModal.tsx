import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { planSchema } from "../validation/schemas";
import type { BillingPlan } from "../types";
import { Button } from "@/shared/components/ui/button";

import { z } from "zod";

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BillingPlan, "id" | "subscribersCount" | "status">) => void;
  editingPlan?: BillingPlan | null;
}

// FormValues type removed to avoid unused variable warning

export function NewPlanModal({ isOpen, onClose, onSubmit, editingPlan }: NewPlanModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price: 0,
      interval: "month" as const,
      seats: 5,
      storageGb: 10,
      featuresCount: 5,
    },
  });

  useEffect(() => {
    if (editingPlan) {
      reset({
        name: editingPlan.name,
        price: editingPlan.price,
        interval: editingPlan.interval,
        seats: editingPlan.seats,
        storageGb: editingPlan.storageGb,
        featuresCount: editingPlan.featuresCount,
      });
    } else {
      reset({
        name: "",
        price: 0,
        interval: "month" as const,
        seats: 5,
        storageGb: 10,
        featuresCount: 5,
      });
    }
  }, [editingPlan, reset, isOpen]);

  const handleFormSubmit = (data: z.infer<typeof planSchema>) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingPlan ? "Edit Plan" : "Create New Plan"}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Plan Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Plan Name
          </label>
          <input
            {...register("name")}
            placeholder="e.g. Starter, Growth, Enterprise"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Price & Billing Interval */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Price (USD)
            </label>
            <input
              type="number"
              {...register("price")}
              placeholder="e.g. 149"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Billing Interval
            </label>
            <select
              {...register("interval")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </div>

        {/* Limits & Features */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Seats Limit
            </label>
            <input
              type="number"
              {...register("seats")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.seats && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.seats.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Storage (GB)
            </label>
            <input
              type="number"
              {...register("storageGb")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.storageGb && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.storageGb.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Features Count
            </label>
            <input
              type="number"
              {...register("featuresCount")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.featuresCount && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.featuresCount.message}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer" disabled={isSubmitting}>
            {editingPlan ? "Save Changes" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
