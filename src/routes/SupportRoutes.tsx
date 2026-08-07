import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { SupportLayout } from "@/modules/support/pages/SupportLayout";

const SupportDashboardPage = lazy(() => import("@/modules/support/pages/SupportDashboardPage"));
const SupportTicketsPage = lazy(() => import("@/modules/support/pages/SupportTicketsPage"));
const BugReportsPage = lazy(() => import("@/modules/support/pages/BugReportsPage"));
const FeatureRequestsPage = lazy(() => import("@/modules/support/pages/FeatureRequestsPage"));
const CustomerRequestsPage = lazy(() => import("@/modules/support/pages/CustomerRequestsPage"));
const AnnouncementsPage = lazy(() => import("@/modules/support/pages/AnnouncementsPage"));
const KnowledgeArticlesPage = lazy(() => import("@/modules/support/pages/KnowledgeArticlesPage"));

export const SupportRoutes = (
  <Route path="support" element={<SupportLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<SupportDashboardPage />} />
    <Route path="tickets" element={<SupportTicketsPage />} />
    <Route path="bugs" element={<BugReportsPage />} />
    <Route path="features" element={<FeatureRequestsPage />} />
    <Route path="customer-requests" element={<CustomerRequestsPage />} />
    <Route path="announcements" element={<AnnouncementsPage />} />
    <Route path="knowledge" element={<KnowledgeArticlesPage />} />
  </Route>
);

export default SupportRoutes;
