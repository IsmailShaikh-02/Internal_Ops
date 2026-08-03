import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { couponSchema } from "../validation/schemas";
import type { Coupon } from "../types";
import { Button } from "@/shared/components/ui/button";

import { z } from "zod";

interface NewCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Coupon, "id" | "status" | "redeemedCount">) => void;
}

// FormValues type removed to avoid unused variable warning

export function NewCouponModal({ isOpen, onClose, onSubmit }: NewCouponModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      discountType: "percentage" as const,
      discountValue: 10,
      duration: "once" as const,
    },
  });

  const durationVal = watch("duration");

  const handleFormSubmit = (data: z.infer<typeof couponSchema>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Discount Coupon">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Coupon Code */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Coupon Code
          </label>
          <input
            {...register("code")}
            placeholder="e.g. WINTER30, SUMMER100"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm uppercase focus:outline-none focus:border-blue-500"
          />
          {errors.code && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.code.message}</p>
          )}
        </div>

        {/* Discount Type & Value */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Discount Type
            </label>
            <select
              {...register("discountType")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Value
            </label>
            <input
              type="number"
              {...register("discountValue")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.discountValue && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.discountValue.message}</p>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Duration
          </label>
          <select
            {...register("duration")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="once">Once (Single billing cycle)</option>
            <option value="repeating">Repeating (Multiple months)</option>
            <option value="forever">Forever</option>
          </select>
        </div>

        {/* Duration Months (conditional) */}
        {durationVal === "repeating" && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Number of Months
            </label>
            <input
              type="number"
              {...register("durationMonths")}
              placeholder="e.g. 3"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.durationMonths && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.durationMonths.message}</p>
            )}
          </div>
        )}

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
            Create Coupon
          </Button>
        </div>
      </form>
    </Modal>
  );
}
