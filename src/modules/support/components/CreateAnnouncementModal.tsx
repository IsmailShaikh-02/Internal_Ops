import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { announcementSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import { z } from "zod";
import { toast } from "sonner";

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateAnnouncementModal({ isOpen, onClose, onSubmit }: CreateAnnouncementModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general" as const,
      scheduledDate: "",
      expiryDate: "",
      targetTenants: ["all"],
    },
  });

  const handleFormSubmit = (data: z.infer<typeof announcementSchema>) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Publish New Announcement">
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Announcement Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Portal maintenance this Sunday"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notice Type
            </label>
            <select
              {...register("type")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="general">General Notice</option>
              <option value="maintenance">Maintenance</option>
              <option value="product_update">Product Update</option>
              <option value="new_feature">New Feature</option>
              <option value="downtime">Downtime Notice</option>
              <option value="security_alert">Security Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Tenant Audience
            </label>
            <select
              multiple
              {...register("targetTenants")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 min-h-12"
            >
              <option value="all">All Tenants (Public)</option>
              <option value="Acme Corp">Acme Corp</option>
              <option value="Stark Industries">Stark Industries</option>
              <option value="Wayne Enterprises">Wayne Enterprises</option>
            </select>
            {errors.targetTenants && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.targetTenants.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
              Schedule Date (Optional)
            </label>
            <input
              type="datetime-local"
              {...register("scheduledDate")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.scheduledDate && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.scheduledDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
              Expiration Date (Optional)
            </label>
            <input
              type="datetime-local"
              {...register("expiryDate")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-xs text-red-500 font-semibold">{errors.expiryDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Announcement Content (Markdown support)
          </label>
          <textarea
            {...register("content")}
            rows={5}
            placeholder="Type announcement details..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.content && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.content.message}</p>
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
            Publish Notice
          </Button>
        </div>
      </form>
    </Modal>
  );
}
