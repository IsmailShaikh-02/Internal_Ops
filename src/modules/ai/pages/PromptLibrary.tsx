import { useState, useMemo, useEffect } from "react";
import { useAiState } from "../hooks/useAiState";
import { type PromptTemplate } from "../types";
import { PromptModal } from "../components/PromptModal";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Search, Edit, Copy, Archive, Trash, FolderOpen } from "lucide-react";
import { toast } from "sonner";

export function PromptLibrary() {
  const {
    promptTemplates,
    addPromptTemplate,
    updatePromptTemplate,
    deletePromptTemplate,
    duplicatePromptTemplate,
  } = useAiState();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<PromptTemplate | null>(null);

  // Subscribe to header event trigger
  useEffect(() => {
    const handleOpenModal = () => {
      setEditItem(null);
      setIsModalOpen(true);
    };
    window.addEventListener("open-new-prompt-modal", handleOpenModal);
    return () => window.removeEventListener("open-new-prompt-modal", handleOpenModal);
  }, []);

  const categories = ["All", "HRMS", "Recruitment", "Payroll", "Attendance", "Support", "Knowledge Base", "General Assistant"];

  // Filtered prompt templates
  const filteredTemplates = useMemo(() => {
    return promptTemplates.filter((t) => {
      const matchCat = selectedCategory === "All" || t.category === selectedCategory;
      const matchSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.promptText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.module.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [promptTemplates, selectedCategory, searchTerm]);

  const handleEdit = (template: PromptTemplate) => {
    setEditItem(template);
    setIsModalOpen(true);
  };

  const handleArchive = (id: string, currentStatus: string) => {
    if (currentStatus === "archived") {
      updatePromptTemplate(id, { status: "active" });
      toast.success("Prompt activated successfully.");
    } else {
      updatePromptTemplate(id, { status: "archived" });
      toast.success("Prompt archived successfully.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Categories scroll area */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-slate-200 bg-white outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Grid view of prompts */}
      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
          <FolderOpen className="h-10 w-10 text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium">No prompts found matching your filters.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-white rounded-xl border p-5 shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                template.status === "archived" ? "opacity-75 border-slate-100 bg-slate-50/50" : "border-slate-200"
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {template.category}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-base mt-0.5">{template.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border">
                      {template.version}
                    </span>
                    <StatusBadge
  variant={
    template.status === "active"
      ? "success"
      : template.status === "draft"
        ? "warning"
        : "neutral"
  }
>
  {template.status.toUpperCase()}
</StatusBadge>
                  </div>
                </div>

                <div className="text-xs text-slate-500 font-semibold bg-slate-50/50 px-2 py-1 rounded">
                  Module: <span className="text-slate-700 font-bold">{template.module}</span>
                </div>

                <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs max-h-[120px] overflow-y-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {template.promptText}
                </div>
              </div>

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400">
                <span>Updated: {template.lastUpdated}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Edit prompt"
                    onClick={() => handleEdit(template)}
                  >
                    <Edit className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title="Duplicate prompt"
                    onClick={() => {
                      duplicatePromptTemplate(template.id);
                      toast.success("Prompt duplicated successfully.");
                    }}
                  >
                    <Copy className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    title={template.status === "archived" ? "Activate prompt" : "Archive prompt"}
                    onClick={() => handleArchive(template.id, template.status)}
                  >
                    <Archive className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    title="Delete prompt"
                    onClick={() => {
                      deletePromptTemplate(template.id);
                      toast.success("Prompt template deleted.");
                    }}
                  >
                    <Trash className="h-4 w-4 text-slate-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prompt creation/edit modal */}
      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addPromptTemplate}
        onEditSubmit={updatePromptTemplate}
        existingTemplates={promptTemplates}
        editItem={editItem}
      />
    </div>
  );
}

export default PromptLibrary;
