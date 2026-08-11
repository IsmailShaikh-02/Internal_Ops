// src/routes/SecurityRoutes.tsx

import { lazy } from "react";
import { Route } from "react-router-dom";
import { SecurityLayout } from "@/modules/security/pages/SecurityLayout";

const SecurityDashboardPage = lazy(() => import("@/modules/security/pages/SecurityDashboardPage"));
const LoginHistoryPage = lazy(() => import("@/modules/security/pages/LoginHistoryPage"));
const FailedLoginsPage = lazy(() => import("@/modules/security/pages/FailedLoginsPage"));
const ActiveSessionsPage = lazy(() => import("@/modules/security/pages/ActiveSessionsPage"));
const BlockedIPsPage = lazy(() => import("@/modules/security/pages/BlockedIPsPage"));
const UserImpersonationPage = lazy(() => import("@/modules/security/pages/UserImpersonationPage"));
const MfaPage = lazy(() => import("@/modules/security/pages/MfaPage"));
const AuditLogsPage = lazy(() => import("@/modules/security/pages/AuditLogsPage"));
const SecurityPoliciesPage = lazy(() => import("@/modules/security/pages/SecurityPoliciesPage"));

export const SecurityRoutes = (
  <Route path="security" element={<SecurityLayout />}>
    <Route index element={<SecurityDashboardPage />} />
    <Route path="login-history" element={<LoginHistoryPage />} />
    <Route path="failed-logins" element={<FailedLoginsPage />} />
    <Route path="active-sessions" element={<ActiveSessionsPage />} />
    <Route path="blocked-ips" element={<BlockedIPsPage />} />
    <Route path="impersonation" element={<UserImpersonationPage />} />
    <Route path="mfa" element={<MfaPage />} />
    <Route path="audit-logs" element={<AuditLogsPage />} />
    <Route path="policies" element={<SecurityPoliciesPage />} />
  </Route>
);

export default SecurityRoutes;
