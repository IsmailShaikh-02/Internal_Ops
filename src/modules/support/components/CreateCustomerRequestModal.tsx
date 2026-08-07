import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { customerRequestSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

interface CreateCustomerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateCustomerRequestModal({ isOpen, onClose, onSubmit }: CreateCustomerRequestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerRequestSchema),
    defaultValues: {
      type: "account_upgrade" as const,
      tenant: "",
      subject: "",
      assignedOwner: "Clark Kent",
      details: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof customerRequestSchema>) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const onInvalid = (errors: any) => {
    const firstErr = Object.values(errors)[0] as any;
    if (firstErr?.message) {
      toast.error(firstErr.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Customer Request">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Request Type
          </label>
          <select
            {...register("type")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="account_upgrade">Account Upgrade</option>
            <option value="data_export">Data Export</option>
            <option value="additional_storage">Additional Storage</option>
            <option value="custom_branding">Custom Branding</option>
            <option value="integration">Integration Requests</option>
            <option value="training">Training Request</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tenant Organization
          </label>
          <input
            {...register("tenant")}
            placeholder="e.g. Wayne Enterprises"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.tenant && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.tenant.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Subject Summary
          </label>
          <input
            {...register("subject")}
            placeholder="e.g. White-labeling domains configuration"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Assigned Operations Owner
          </label>
          <select
            {...register("assignedOwner")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="Clark Kent">Clark Kent</option>
            <option value="Lois Lane">Lois Lane</option>
            <option value="Bruce Wayne">Bruce Wayne</option>
          </select>
          {errors.assignedOwner && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.assignedOwner.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Request Notes
          </label>
          <textarea
            {...register("details")}
            rows={4}
            placeholder="Provide specific parameters, quantities, domain configurations, etc..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.details && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.details.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl cursor-pointer"
            disabled={isSubmitting}
          >
            Create Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
