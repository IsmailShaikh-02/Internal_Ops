import { useState, useEffect } from "react";
import { useAiState } from "../hooks/useAiState";
import { type PromptTemplate } from "../types";
import { PromptModal } from "../components/PromptModal";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Edit, Copy, Archive, Globe, Eye } from "lucide-react";
import { toast } from "sonner";

export function PromptTemplates() {
  const {
    promptTemplates,
    addPromptTemplate,
    updatePromptTemplate,
    duplicatePromptTemplate,
  } = useAiState();

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

  const handleEdit = (template: PromptTemplate) => {
    setEditItem(template);
    setIsModalOpen(true);
  };

  const handlePublish = (id: string, currentStatus: string) => {
    if (currentStatus === "draft") {
      updatePromptTemplate(id, { status: "active" });
      toast.success("Prompt template published to production.");
    } else {
      updatePromptTemplate(id, { status: "draft" });
      toast.info("Prompt template set to draft status.");
    }
  };

  const handleArchive = (id: string, currentStatus: string) => {
    if (currentStatus === "archived") {
      updatePromptTemplate(id, { status: "active" });
      toast.success("Prompt template restored.");
    } else {
      updatePromptTemplate(id, { status: "archived" });
      toast.success("Prompt template archived successfully.");
    }
  };

  const handleDuplicate = (id: string) => {
    duplicatePromptTemplate(id);
    toast.success("Prompt template duplicated successfully.");
  };

  // Columns Configuration
  const columns = [
    {
      key: "name",
      header: "Template Name",
      render: (row: PromptTemplate) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{row.name}</span>
          <span className="text-[10px] text-slate-400 font-medium font-mono">{row.category}</span>
        </div>
      ),
    },
    {
      key: "module",
      header: "Module",
      render: (row: PromptTemplate) => (
        <span className="text-slate-600 text-sm">{row.module}</span>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (row: PromptTemplate) => (
        <span className="text-slate-500 text-xs font-mono bg-slate-50 px-2 py-0.5 rounded border">
          {row.version}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: PromptTemplate) => (
        <StatusBadge
  variant={
    row.status === "active"
      ? "success"
      : row.status === "draft"
        ? "warning"
        : "neutral"
  }
>
  {row.status.toUpperCase()}
</StatusBadge>
      ),
    },
    {
      key: "lastUpdated",
      header: "Last Updated",
      render: (row: PromptTemplate) => (
        <span className="text-slate-500 text-xs">{row.lastUpdated}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: PromptTemplate) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Duplicate"
            onClick={() => handleDuplicate(row.id)}
          >
            <Copy className="h-4 w-4 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={row.status === "draft" ? "Publish to Production" : "Revert to Draft"}
            onClick={() => handlePublish(row.id, row.status)}
            disabled={row.status === "archived"}
          >
            <Globe className={`h-4 w-4 ${row.status === "draft" ? "text-blue-500" : "text-slate-400"}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={row.status === "archived" ? "Restore" : "Archive"}
            onClick={() => handleArchive(row.id, row.status)}
          >
            <Archive className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Templates Ledger Table */}
      <DataTable
        title="Standardized Prompt Templates"
        data={promptTemplates}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search template name or module..."
        searchFields={["name", "module", "category"]}
        pageSize={6}
      />

      {/* Prompt Create/Edit Modal */}
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

export default PromptTemplates;
