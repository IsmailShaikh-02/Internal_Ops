import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { FeatureLayout } from "@/modules/features/pages/FeatureLayout";

const ModulesPage = lazy(() => import("@/modules/features/pages/ModulesPage"));
const FeatureFlagsPage = lazy(() => import("@/modules/features/pages/FeatureFlagsPage"));
const TenantOverridesPage = lazy(() => import("@/modules/features/pages/TenantOverridesPage"));
const PlanFeatureMappingPage = lazy(() => import("@/modules/features/pages/PlanFeatureMappingPage"));
const ReleaseManagementPage = lazy(() => import("@/modules/features/pages/ReleaseManagementPage"));

export const FeatureRoutes = (
  <Route path="features" element={<FeatureLayout />}>
    <Route index element={<Navigate to="modules" replace />} />
    <Route path="modules" element={<ModulesPage />} />
    <Route path="flags" element={<FeatureFlagsPage />} />
    <Route path="overrides" element={<TenantOverridesPage />} />
    <Route path="plans" element={<PlanFeatureMappingPage />} />
    <Route path="releases" element={<ReleaseManagementPage />} />
  </Route>
);
