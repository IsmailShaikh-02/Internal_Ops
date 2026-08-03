import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { refundSchema } from "../validation/schemas";
import type { Refund, Payment } from "../types";
import { Button } from "@/shared/components/ui/button";
import { useEffect } from "react";

import { z } from "zod";

interface IssueRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Refund, "id" | "status" | "createdDate">) => void;
  payments: Payment[];
}

// FormValues type removed to avoid unused variable warning

export function IssueRefundModal({ isOpen, onClose, onSubmit, payments }: IssueRefundModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      paymentId: "",
      amount: 0,
      reason: "",
    },
  });

  const selectedPaymentId = watch("paymentId");

  // Autofill amount when payment is selected
  useEffect(() => {
    const selectedPayment = payments.find((p) => p.id === selectedPaymentId);
    if (selectedPayment) {
      setValue("amount", selectedPayment.amount);
    }
  }, [selectedPaymentId, payments, setValue]);

  const handleFormSubmit = (data: z.infer<typeof refundSchema>) => {
    const selectedPayment = payments.find((p) => p.id === data.paymentId);
    if (!selectedPayment) return;

    onSubmit({
      paymentId: data.paymentId,
      tenantName: selectedPayment.tenantName,
      amount: data.amount,
      reason: data.reason,
    });
    reset();
    onClose();
  };

  const succeededPayments = payments.filter((p) => p.status === "succeeded");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Transaction Refund">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Payment Select */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Succeeded Payment
          </label>
          <select
            {...register("paymentId")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="">-- Choose payment transaction --</option>
            {succeededPayments.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tenantName} - {p.invoiceNumber} (${p.amount})
              </option>
            ))}
          </select>
          {errors.paymentId && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.paymentId.message}</p>
          )}
        </div>

        {/* Refund Amount */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Refund Amount (USD)
          </label>
          <input
            type="number"
            {...register("amount")}
            placeholder="e.g. 150"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.amount.message}</p>
          )}
        </div>

        {/* Reason */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Refund Reason
          </label>
          <textarea
            {...register("reason")}
            placeholder="Describe the reason for the refund..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-20"
          />
          {errors.reason && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.reason.message}</p>
          )}
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
            Process Refund
          </Button>
        </div>
      </form>
    </Modal>
  );
}
