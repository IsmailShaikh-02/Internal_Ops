import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";
import { BillingLayout } from "@/modules/billing/pages/BillingLayout";

const RevenueDashboardPage = lazy(() => import("@/modules/billing/pages/RevenueDashboardPage"));
const PlansPage = lazy(() => import("@/modules/billing/pages/PlansPage"));
const PlanComparisonPage = lazy(() => import("@/modules/billing/pages/PlanComparisonPage"));
const SubscriptionsPage = lazy(() => import("@/modules/billing/pages/SubscriptionsPage"));
const InvoicesPage = lazy(() => import("@/modules/billing/pages/InvoicesPage"));
const PaymentsPage = lazy(() => import("@/modules/billing/pages/PaymentsPage"));
const RefundsPage = lazy(() => import("@/modules/billing/pages/RefundsPage"));
const CouponsPage = lazy(() => import("@/modules/billing/pages/CouponsPage"));
const TaxesPage = lazy(() => import("@/modules/billing/pages/TaxesPage"));
const RevenueReportsPage = lazy(() => import("@/modules/billing/pages/RevenueReportsPage"));

export const BillingRoutes = (
  <Route path="billing" element={<BillingLayout />}>
    {/* Default redirect to dashboard */}
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<RevenueDashboardPage />} />
    <Route path="plans" element={<PlansPage />} />
    <Route path="comparison" element={<PlanComparisonPage />} />
    <Route path="subscriptions" element={<SubscriptionsPage />} />
    <Route path="invoices" element={<InvoicesPage />} />
    <Route path="payments" element={<PaymentsPage />} />
    <Route path="refunds" element={<RefundsPage />} />
    <Route path="coupons" element={<CouponsPage />} />
    <Route path="taxes" element={<TaxesPage />} />
    <Route path="reports" element={<RevenueReportsPage />} />
  </Route>
);
