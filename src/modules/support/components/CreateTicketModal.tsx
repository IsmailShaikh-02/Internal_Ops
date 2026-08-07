import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { ticketSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateTicketModal({ isOpen, onClose, onSubmit }: CreateTicketModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      tenant: "",
      subject: "",
      category: "Troubleshooting",
      priority: "medium" as const,
      assignedAgent: "Sarah Jenkins",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      description: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof ticketSchema>) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create Support Ticket">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tenant Organization
          </label>
          <input
            {...register("tenant")}
            placeholder="e.g. Acme Corp"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.tenant && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.tenant.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Subject / Issue Summary
          </label>
          <input
            {...register("subject")}
            placeholder="e.g. Server response latency spike"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.subject.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Getting Started">Getting Started</option>
              <option value="HRMS">HRMS</option>
              <option value="Billing">Billing</option>
              <option value="Security">Security</option>
              <option value="Integrations">Integrations</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="FAQs">FAQs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Agent
            </label>
            <select
              {...register("assignedAgent")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="Alex Mercer">Alex Mercer</option>
              <option value="Unassigned">Unassigned</option>
            </select>
            {errors.assignedAgent && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.assignedAgent.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Initial Message / Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe the issue detail..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.description.message}</p>
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
            Create Ticket
          </Button>
        </div>
      </form>
    </Modal>
  );
}
