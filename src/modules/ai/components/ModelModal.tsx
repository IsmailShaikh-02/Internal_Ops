import React, { useState, useEffect } from "react";
import { type AIModelConfig } from "../types";
import { validateModelConfig, type ValidationError } from "../validation/validation";
import { Button } from "@/shared/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<AIModelConfig, "id">) => void;
  onEditSubmit?: (id: string, data: Partial<AIModelConfig>) => void;
  existingModels: AIModelConfig[];
  editItem?: AIModelConfig | null;
}

export function ModelModal({
  isOpen,
  onClose,
  onSubmit,
  onEditSubmit,
  existingModels,
  editItem,
}: ModelModalProps) {
  const [provider, setProvider] = useState("OpenAI");
  const [modelName, setModelName] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [costPerToken, setCostPerToken] = useState(0.001);
  const [costPerCompletionToken, setCostPerCompletionToken] = useState(0.002);
  const [contextWindow, setContextWindow] = useState(16384);
  const [tokenLimit, setTokenLimit] = useState(40000);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [isDefault, setIsDefault] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (editItem) {
      setProvider(editItem.provider);
      setModelName(editItem.modelName);
      setVersion(editItem.version);
      setStatus(editItem.status);
      setCostPerToken(editItem.costPerToken);
      setCostPerCompletionToken(editItem.costPerCompletionToken);
      setContextWindow(editItem.contextWindow);
      setTokenLimit(editItem.tokenLimit);
      setTemperature(editItem.temperature);
      setMaxTokens(editItem.maxTokens);
      setIsDefault(editItem.isDefault);
      setApiKey(editItem.apiKey);
    } else {
      setProvider("OpenAI");
      setModelName("");
      setVersion("");
      setStatus("active");
      setCostPerToken(0.001);
      setCostPerCompletionToken(0.002);
      setContextWindow(16384);
      setTokenLimit(40000);
      setTemperature(0.7);
      setMaxTokens(2048);
      setIsDefault(false);
      setApiKey("");
    }
    setErrors([]);
  }, [editItem, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const modelData: Partial<AIModelConfig> = {
      id: editItem?.id,
      provider,
      modelName,
      version,
      status,
      costPerToken: Number(costPerToken),
      costPerCompletionToken: Number(costPerCompletionToken),
      contextWindow: Number(contextWindow),
      tokenLimit: Number(tokenLimit),
      temperature: Number(temperature),
      maxTokens: Number(maxTokens),
      isDefault,
      apiKey,
    };

    const validationErrors = validateModelConfig(modelData, existingModels);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      toast.error("Please resolve validation errors.");
      return;
    }

    if (editItem && onEditSubmit) {
      onEditSubmit(editItem.id, modelData);
      toast.success("AI Model configuration updated.");
    } else {
      onSubmit({
        provider,
        modelName,
        version,
        status,
        costPerToken: Number(costPerToken),
        costPerCompletionToken: Number(costPerCompletionToken),
        contextWindow: Number(contextWindow),
        tokenLimit: Number(tokenLimit),
        temperature: Number(temperature),
        maxTokens: Number(maxTokens),
        isDefault,
        apiKey,
      });
      toast.success("New AI Model added successfully.");
    }
    onClose();
  };

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            {editItem ? "Configure AI Model" : "Add New AI Model"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Provider</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden"
              >
                <option value="OpenAI">OpenAI</option>
                <option value="Anthropic">Anthropic</option>
                <option value="Google">Google</option>
                <option value="Meta">Meta</option>
                <option value="Mistral">Mistral</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Model Name</label>
              <input
                type="text"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
                placeholder="e.g. gpt-4o"
              />
              {getError("modelName") && <p className="text-red-500 text-xs">{getError("modelName")}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Version</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
                placeholder="e.g. 2024-05-13"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">API Connection Key / Credentials</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900 font-mono"
              placeholder="sk-proj-••••••••••••••••••••"
            />
            {getError("apiKey") && <p className="text-red-500 text-xs">{getError("apiKey")}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prompt Token Cost (1K)</label>
              <input
                type="number"
                step="0.0001"
                value={costPerToken}
                onChange={(e) => setCostPerToken(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comp. Token Cost (1K)</label>
              <input
                type="number"
                step="0.0001"
                value={costPerCompletionToken}
                onChange={(e) => setCostPerCompletionToken(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Context Window</label>
              <input
                type="number"
                value={contextWindow}
                onChange={(e) => setContextWindow(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Token Rate Limit / min</label>
              <input
                type="number"
                value={tokenLimit}
                onChange={(e) => setTokenLimit(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
              {getError("tokenLimit") && <p className="text-red-500 text-xs">{getError("tokenLimit")}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
              {getError("temperature") && <p className="text-red-500 text-xs">{getError("temperature")}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Output Tokens</label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-hidden focus:ring-1 focus:ring-slate-900"
              />
              {getError("maxTokens") && <p className="text-red-500 text-xs">{getError("maxTokens")}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-4 w-4"
            />
            <label htmlFor="isDefault" className="text-sm font-semibold text-slate-700">
              Set as Default Model for the platform
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editItem ? "Save Config" : "Add Model"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
