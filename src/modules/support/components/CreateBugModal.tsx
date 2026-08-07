import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { bugSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

interface CreateBugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateBugModal({ isOpen, onClose, onSubmit }: CreateBugModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: "",
      description: "",
      severity: "medium" as const,
      assignedDeveloper: "Unassigned",
      tenant: "",
      releaseVersion: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof bugSchema>) => {
    onSubmit({
      ...data,
      screenshots: []
    });
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
    <Modal isOpen={isOpen} onClose={onClose} title="Report New Bug / Defect">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Bug Title / Short Summary
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Memory leak on audit exports"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Defect Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Provide repro steps, expected vs actual behavior..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Severity Level
            </label>
            <select
              {...register("severity")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical (Immediate SLA)</option>
            </select>
            {errors.severity && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.severity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Developer
            </label>
            <select
              {...register("assignedDeveloper")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="Unassigned">Unassigned</option>
              <option value="Diana Prince">Diana Prince</option>
              <option value="Bruce Wayne">Bruce Wayne</option>
              <option value="Clark Kent">Clark Kent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reporting Tenant / Source
            </label>
            <input
              {...register("tenant")}
              placeholder="e.g. Acme Corp or Internal"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.tenant && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.tenant.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Release Version (Optional)
            </label>
            <input
              {...register("releaseVersion")}
              placeholder="e.g. v2.4.0"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
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
            Submit Bug Report
          </Button>
        </div>
      </form>
    </Modal>
  );
}
