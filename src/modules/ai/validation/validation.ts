import { type AIModelConfig, type PromptTemplate } from "../types";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateModelConfig(
  config: Partial<AIModelConfig>,
  existingModels: AIModelConfig[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Model Name unique
  if (!config.modelName || !config.modelName.trim()) {
    errors.push({ field: "modelName", message: "Model name is required." });
  } else {
    const nameExists = existingModels.some(
      (m) =>
        m.modelName.toLowerCase() === config.modelName?.trim().toLowerCase() &&
        m.id !== config.id
    );
    if (nameExists) {
      errors.push({ field: "modelName", message: "Model name must be unique." });
    }
  }

  // Provider
  if (!config.provider || !config.provider.trim()) {
    errors.push({ field: "provider", message: "Provider is required." });
  }

  // Token Limits > 0
  if (config.tokenLimit === undefined || config.tokenLimit <= 0) {
    errors.push({ field: "tokenLimit", message: "Token limit must be greater than zero." });
  }

  // Temperature between 0 and 2
  if (config.temperature === undefined || config.temperature < 0 || config.temperature > 2) {
    errors.push({ field: "temperature", message: "Temperature must be between 0.0 and 2.0." });
  }

  // Max Tokens positive integer
  if (config.maxTokens === undefined || config.maxTokens <= 0 || !Number.isInteger(config.maxTokens)) {
    errors.push({ field: "maxTokens", message: "Maximum tokens must be a positive integer." });
  }

  // API Key checked if active
  if (config.status === "active" && (!config.apiKey || !config.apiKey.trim() || config.apiKey.includes("•••") && config.apiKey.length < 5)) {
    // Note: in mock data we have placeholders, but if user enters empty, flag it.
    if (!config.apiKey || !config.apiKey.trim()) {
      errors.push({ field: "apiKey", message: "API key/credentials are required to activate the model." });
    }
  }

  return errors;
}

export function validatePromptTemplate(
  template: Partial<PromptTemplate>,
  existingTemplates: PromptTemplate[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Prompt Name unique within category
  if (!template.name || !template.name.trim()) {
    errors.push({ field: "name", message: "Template name is required." });
  } else if (template.category) {
    const nameExists = existingTemplates.some(
      (t) =>
        t.category.toLowerCase() === template.category?.toLowerCase() &&
        t.name.toLowerCase() === template.name?.trim().toLowerCase() &&
        t.id !== template.id
    );
    if (nameExists) {
      errors.push({ field: "name", message: "Prompt name must be unique within the selected category." });
    }
  }

  if (!template.category) {
    errors.push({ field: "category", message: "Category is required." });
  }

  if (!template.module) {
    errors.push({ field: "module", message: "Module assignment is required." });
  }

  if (!template.promptText || !template.promptText.trim()) {
    errors.push({ field: "promptText", message: "Prompt instruction text is required." });
  }

  return errors;
}
