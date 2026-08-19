export interface AIUsageRequest {
  id: string;
  tenant: string;
  module: string;
  feature: string;
  user: string;
  requestTime: string;
  modelUsed: string;
  processingTime: number; // in ms
  status: "success" | "failed";
  tokensUsed: number;
}

export interface TokenUsageRecord {
  id: string;
  tenant: string;
  user: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  remainingQuota: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  module: string;
  version: string;
  status: "active" | "archived" | "draft";
  lastUpdated: string;
  promptText: string;
}

export interface AIModelConfig {
  id: string;
  provider: string;
  modelName: string;
  version: string;
  status: "active" | "inactive";
  costPerToken: number; // cost per 1k tokens
  costPerCompletionToken: number;
  contextWindow: number;
  tokenLimit: number;
  temperature: number;
  maxTokens: number;
  isDefault: boolean;
  apiKey: string;
}

export interface AICostRecord {
  id: string;
  date: string;
  tenant: string;
  module: string;
  model: string;
  cost: number;
  tokens: number;
}

export interface AIAnalyticsMetric {
  featureName: string;
  requestsCount: number;
  adoptionRate: number;
  avgResponseTime: number;
  errorRate: number;
  userSatisfaction: number; // 0 to 5
  successRate: number;
}
