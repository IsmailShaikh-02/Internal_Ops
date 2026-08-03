import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { taxRateSchema } from "../validation/schemas";
import type { TaxRate } from "../types";
import { Button } from "@/shared/components/ui/button";

import { z } from "zod";

interface AddTaxRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TaxRate, "id">) => void;
}

// FormValues type removed to avoid unused variable warning

export function AddTaxRateModal({ isOpen, onClose, onSubmit }: AddTaxRateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      country: "",
      name: "",
      rate: 0,
      description: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof taxRateSchema>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Tax Rate">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Country / Region */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Country / Region Code
          </label>
          <input
            {...register("country")}
            placeholder="e.g. US, EU, UK, IN"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.country && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.country.message}</p>
          )}
        </div>

        {/* Tax Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tax Name / Type
          </label>
          <input
            {...register("name")}
            placeholder="e.g. VAT, GST, Sales Tax"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Tax Rate Percentage */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tax Rate (%)
          </label>
          <input
            type="number"
            {...register("rate")}
            placeholder="e.g. 18"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.rate && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.rate.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Description
          </label>
          <textarea
            {...register("description")}
            placeholder="e.g. Standard rate for digital goods"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-20"
          />
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
            Add Rate
          </Button>
        </div>
      </form>
    </Modal>
  );
}
