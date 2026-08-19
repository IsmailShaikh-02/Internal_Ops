import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { AiLayout } from "@/modules/ai/pages/AiLayout";

const AiDashboard = lazy(() => import("@/modules/ai/pages/AiDashboard"));
const AiUsage = lazy(() => import("@/modules/ai/pages/AiUsage"));
const TokenUsage = lazy(() => import("@/modules/ai/pages/TokenUsage"));
const AiAnalytics = lazy(() => import("@/modules/ai/pages/AiAnalytics"));
const CostAnalytics = lazy(() => import("@/modules/ai/pages/CostAnalytics"));
const PromptLibrary = lazy(() => import("@/modules/ai/pages/PromptLibrary"));
const PromptTemplates = lazy(() => import("@/modules/ai/pages/PromptTemplates"));
const ModelConfiguration = lazy(() => import("@/modules/ai/pages/ModelConfiguration"));

export const AiRoutes = (
  <Route path="ai" element={<AiLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<AiDashboard />} />
    <Route path="usage" element={<AiUsage />} />
    <Route path="token-usage" element={<TokenUsage />} />
    <Route path="analytics" element={<AiAnalytics />} />
    <Route path="cost-analytics" element={<CostAnalytics />} />
    <Route path="prompt-library" element={<PromptLibrary />} />
    <Route path="prompt-templates" element={<PromptTemplates />} />
    <Route path="model-configuration" element={<ModelConfiguration />} />
  </Route>
);

export default AiRoutes;
