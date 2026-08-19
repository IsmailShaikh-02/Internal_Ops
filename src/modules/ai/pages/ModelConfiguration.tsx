import { useState, useEffect } from "react";
import { useAiState } from "../hooks/useAiState";
import { type AIModelConfig } from "../types";
import { ModelModal } from "../components/ModelModal";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Switch } from "@/shared/components/ui/Switch";
import { Edit, Star } from "lucide-react";
import { toast } from "sonner";

export function ModelConfiguration() {
  const {
    models,
    addModel,
    updateModel,
    setDefaultModel,
  } = useAiState();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AIModelConfig | null>(null);

  // Subscribe to header event trigger
  useEffect(() => {
    const handleOpenModal = () => {
      setEditItem(null);
      setIsModalOpen(true);
    };
    window.addEventListener("open-new-model-modal", handleOpenModal);
    return () => window.removeEventListener("open-new-model-modal", handleOpenModal);
  }, []);

  const handleEdit = (model: AIModelConfig) => {
    setEditItem(model);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (id: string, currentStatus: "active" | "inactive") => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    updateModel(id, { status: nextStatus });
    toast.success(`Model is now ${nextStatus}.`);
  };

  const handleSetDefault = (id: string) => {
    setDefaultModel(id);
    toast.success("Default platform model updated.");
  };

  // Columns Configuration
  const columns = [
    {
      key: "modelName",
      header: "Model Name",
      render: (row: AIModelConfig) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{row.modelName}</span>
            <span className="text-[10px] text-slate-400 font-medium">{row.provider}</span>
          </div>
          {row.isDefault && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 gap-0.5">
              <Star className="h-2.5 w-2.5 fill-amber-600 text-amber-600" />
              Default
            </span>
          )}
        </div>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (row: AIModelConfig) => (
        <span className="text-slate-500 text-xs font-mono">{row.version}</span>
      ),
    },
    {
      key: "contextWindow",
      header: "Context Window",
      render: (row: AIModelConfig) => (
        <span className="text-slate-600 font-mono text-xs">{row.contextWindow.toLocaleString()} tokens</span>
      ),
    },
    {
      key: "tokenLimit",
      header: "Rate Limit (tokens/min)",
      render: (row: AIModelConfig) => (
        <span className="text-slate-600 font-mono text-xs">{row.tokenLimit.toLocaleString()}</span>
      ),
    },
    {
      key: "cost",
      header: "Cost per 1K Prompt / Completion",
      render: (row: AIModelConfig) => (
        <span className="text-slate-600 font-mono text-xs">
          ${row.costPerToken.toFixed(4)} / ${row.costPerCompletionToken.toFixed(4)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Uptime Status",
      render: (row: AIModelConfig) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.status === "active"}
            onCheckedChange={() => handleToggleStatus(row.id, row.status)}
          />
          <StatusBadge
  variant={row.status === "active" ? "success" : "neutral"}
>
  {row.status === "active" ? "Active" : "Inactive"}
</StatusBadge>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: AIModelConfig) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Edit configuration"
            onClick={() => handleEdit(row)}
          >
            <Edit className="h-4 w-4 text-slate-500" />
          </Button>
          {!row.isDefault && row.status === "active" && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title="Set as platform default"
              onClick={() => handleSetDefault(row.id)}
            >
              <Star className="h-4 w-4 text-slate-400 hover:text-amber-500 hover:fill-amber-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Model config table */}
      <DataTable
        title="AI LLM Model Configurator"
        data={models}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search model name or provider..."
        searchFields={["modelName", "provider"]}
        pageSize={5}
      />

      {/* Model configuration modal */}
      <ModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addModel}
        onEditSubmit={updateModel}
        existingModels={models}
        editItem={editItem}
      />
    </div>
  );
}

export default ModelConfiguration;
