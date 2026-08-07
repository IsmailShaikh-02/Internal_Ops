import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { featureSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

interface CreateFeatureRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateFeatureRequestModal({ isOpen, onClose, onSubmit }: CreateFeatureRequestModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Integrations",
      createdBy: "",
    },
  });

  const handleFormSubmit = (data: z.infer<typeof featureSchema>) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Feature Request">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Feature Request Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Export audits to S3 bucket directly"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            {...register("category")}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="Security">Security</option>
            <option value="Integrations">Integrations</option>
            <option value="Billing">Billing</option>
            <option value="HRMS">HRMS</option>
            <option value="Performance">Performance</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Requesting Tenant / Organization
          </label>
          <input
            {...register("createdBy")}
            placeholder="e.g. Acme Corp"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.createdBy && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.createdBy.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Detailed Feature Description & Benefit
          </label>
          <textarea
            {...register("description")}
            rows={5}
            placeholder="Provide a detailed explanation of what this feature does and how it helps..."
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
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
