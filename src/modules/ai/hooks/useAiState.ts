import { create } from "zustand";
import { type AIModelConfig, type PromptTemplate, type AIUsageRequest, type TokenUsageRecord, type AICostRecord } from "../types";
import { mockModels, mockPromptTemplates, mockUsageRequests, mockTokenUsage, mockCostRecords } from "../data/mockData";

interface AiStore {
  models: AIModelConfig[];
  promptTemplates: PromptTemplate[];
  usageRequests: AIUsageRequest[];
  tokenUsage: TokenUsageRecord[];
  costRecords: AICostRecord[];

  addModel: (model: Omit<AIModelConfig, "id">) => void;
  updateModel: (id: string, updates: Partial<AIModelConfig>) => void;
  deleteModel: (id: string) => void;
  setDefaultModel: (id: string) => void;

  addPromptTemplate: (template: Omit<PromptTemplate, "id" | "lastUpdated">) => void;
  updatePromptTemplate: (id: string, updates: Partial<PromptTemplate>) => void;
  deletePromptTemplate: (id: string) => void;
  duplicatePromptTemplate: (id: string) => void;
}

export const useAiStore = create<AiStore>((set) => ({
  models: mockModels,
  promptTemplates: mockPromptTemplates,
  usageRequests: mockUsageRequests,
  tokenUsage: mockTokenUsage,
  costRecords: mockCostRecords,

  addModel: (newModel) =>
    set((state) => {
      const id = `model-${Date.now()}`;
      let updatedModels = [...state.models];
      if (newModel.isDefault) {
        updatedModels = updatedModels.map((m) => ({ ...m, isDefault: false }));
      }
      return {
        models: [
          ...updatedModels,
          {
            ...newModel,
            id,
          },
        ],
      };
    }),

  updateModel: (id, updates) =>
    set((state) => {
      let updatedModels = state.models.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      if (updates.isDefault) {
        updatedModels = updatedModels.map((m) =>
          m.id === id ? m : { ...m, isDefault: false }
        );
      }
      return { models: updatedModels };
    }),

  deleteModel: (id) =>
    set((state) => ({
      models: state.models.filter((m) => m.id !== id),
    })),

  setDefaultModel: (id) =>
    set((state) => ({
      models: state.models.map((m) => ({
        ...m,
        isDefault: m.id === id,
      })),
    })),

  addPromptTemplate: (newTemplate) =>
    set((state) => {
      const id = `prompt-${Date.now()}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        promptTemplates: [
          ...state.promptTemplates,
          {
            ...newTemplate,
            id,
            lastUpdated: formattedDate,
          },
        ],
      };
    }),

  updatePromptTemplate: (id, updates) =>
    set((state) => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        promptTemplates: state.promptTemplates.map((t) =>
          t.id === id
            ? { ...t, ...updates, lastUpdated: formattedDate }
            : t
        ),
      };
    }),

  deletePromptTemplate: (id) =>
    set((state) => ({
      promptTemplates: state.promptTemplates.filter((t) => t.id !== id),
    })),

  duplicatePromptTemplate: (id) =>
    set((state) => {
      const source = state.promptTemplates.find((t) => t.id === id);
      if (!source) return {};
      const newId = `prompt-${Date.now()}`;
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }) + " " + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return {
        promptTemplates: [
          ...state.promptTemplates,
          {
            ...source,
            id: newId,
            name: `${source.name} (Copy)`,
            version: `${source.version}-copy`,
            lastUpdated: formattedDate,
          },
        ],
      };
    }),
}));

export const useAiState = useAiStore;

