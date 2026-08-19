import React, { useState, useEffect } from "react";
import { type PromptTemplate } from "../types";
import { validatePromptTemplate, type ValidationError } from "../validation/validation";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PromptTemplate, "id" | "lastUpdated">) => void;
  onEditSubmit?: (id: string, data: Partial<PromptTemplate>) => void;
  existingTemplates: PromptTemplate[];
  editItem?: PromptTemplate | null;
}

export function PromptModal({
  isOpen,
  onClose,
  onSubmit,
  onEditSubmit,
  existingTemplates,
  editItem,
}: PromptModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("HRMS");
  const [module, setModule] = useState("HR Operations");
  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState<"active" | "draft" | "archived">("active");
  const [promptText, setPromptText] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (editItem) {
      setName(editItem.name);
      setCategory(editItem.category);
      setModule(editItem.module);
      setVersion(editItem.version);
      setStatus(editItem.status);
      setPromptText(editItem.promptText);
    } else {
      setName("");
      setCategory("HRMS");
      setModule("HR Operations");
      setVersion("v1.0");
      setStatus("active");
      setPromptText("");
    }
    setErrors([]);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const categories = ["HRMS", "Recruitment", "Payroll", "Attendance", "Support", "Knowledge Base", "General Assistant"];
  const statuses: ("active" | "draft" | "archived")[] = ["active", "draft", "archived"];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const templateData: Partial<PromptTemplate> = {
      id: editItem?.id,
      name,
      category,
      module,
      version,
      status,
      promptText,
    };

    const validationErrors = validatePromptTemplate(templateData, existingTemplates);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error("Please resolve validation issues.");
      return;
    }

    if (editItem && onEditSubmit) {
      onEditSubmit(editItem.id, templateData);
      toast.success("Prompt template updated successfully.");
    } else {
      onSubmit({
        name,
        category,
        module,
        version,
        status,
        promptText,
      });
      toast.success("New prompt template created successfully.");
    }
    onClose();
  };

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            {editItem ? "Edit Prompt Template" : "Create New Prompt"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              placeholder="e.g. Resume Screener Assistant"
            />
            {getError("name") && <p className="text-red-500 text-xs">{getError("name")}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Module Assignment</label>
              <input
                type="text"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
                placeholder="e.g. Talent Acquisition"
              />
              {getError("module") && <p className="text-red-500 text-xs">{getError("module")}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
                placeholder="e.g. v1.0"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Instruction Template</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900 font-mono"
              placeholder="Use double braces for variables, e.g. {{job_description}}..."
            />
            {getError("promptText") && <p className="text-red-500 text-xs">{getError("promptText")}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? "Save Changes" : "Create Prompt"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
