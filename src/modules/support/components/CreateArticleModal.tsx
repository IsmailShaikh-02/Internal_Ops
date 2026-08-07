import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "./Modal";
import { articleSchema } from "../validation/schemas";
import { Button } from "@/shared/components/ui/button";
import type { KnowledgeArticle } from "../types";
import { z } from "zod";
import { toast } from "sonner";

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingArticle?: KnowledgeArticle | null;
}

export function CreateArticleModal({ isOpen, onClose, onSubmit, editingArticle }: CreateArticleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "getting_started" as const,
      status: "published" as const,
      notes: "Initial revision",
    },
  });

  useEffect(() => {
    if (editingArticle) {
      reset({
        title: editingArticle.title,
        content: editingArticle.content,
        category: editingArticle.category,
        status: editingArticle.status,
        notes: `Updated to version ${editingArticle.version + 1}`,
      });
    } else {
      reset({
        title: "",
        content: "",
        category: "getting_started" as const,
        status: "published" as const,
        notes: "Initial revision",
      });
    }
  }, [editingArticle, reset, isOpen]);

  const handleFormSubmit = (data: z.infer<typeof articleSchema>) => {
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
    <Modal isOpen={isOpen} onClose={onClose} title={editingArticle ? "Edit Knowledge Article" : "Create Knowledge Article"}>
      <form onSubmit={handleSubmit(handleFormSubmit, onInvalid)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
            Article Title
          </label>
          <input
            {...register("title")}
            placeholder="e.g. Setting up custom SAML integrations"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
              Category
            </label>
            <select
              {...register("category")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="getting_started">Getting Started</option>
              <option value="hrms">HRMS</option>
              <option value="billing">Billing</option>
              <option value="security">Security</option>
              <option value="integrations">Integrations</option>
              <option value="troubleshooting">Troubleshooting</option>
              <option value="faqs">FAQs</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
              Publish Status
            </label>
            <select
              {...register("status")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
            Revision Change Notes (Version History)
          </label>
          <input
            {...register("notes")}
            placeholder="e.g. Added section for Microsoft Entra ID integration."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-semibold">
            Article Content (Markdown support)
          </label>
          <textarea
            {...register("content")}
            rows={8}
            placeholder="Type body details here..."
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
            {editingArticle ? "Save Changes & Revise" : "Create Article"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
