// src/routes/index.tsx
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Root Layout Adapter
import RootLayout from './RootLayout';

// Shared Loading Primitive
import { Skeleton } from '@/shared/components/ui/skeleton';

// Route Guards
import AuthGuard from '@/app/guards/AuthGuard';

// Auth Pages
import LoginPage from '@/modules/auth/pages/LoginPage';
import UnauthorizedPage from '@/modules/auth/pages/UnauthorizedPage';

// Modular Route Configurations
import { DashboardRoutes } from './DashboardRoutes';
import { TenantRoutes } from './TenantRoutes';
import { BillingRoutes } from './BillingRoutes';
import { FeatureRoutes } from './FeatureRoutes';
import { UserRoutes } from './UserRoutes';
import { SupportRoutes } from './SupportRoutes';
import { MonitorRoutes } from './Monitor';
import { SecurityRoutes } from './SecurityRoutes';
import { AiRoutes } from './AiRoutes';
// import { IntegrationRoutes } from './IntegrationRoutes';

// import { ReportRoutes } from './ReportRoutes';
// import { SettingsRoutes } from './SettingsRoutes';

// Global Fallback Loader
const PageLoader = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-32 w-full rounded-xl" />
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Standalone Authentication and Exception Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/403-unauthorized" element={<UnauthorizedPage />} />

          {/* Main Console Layout Shell (Protected) */}
          <Route element={<AuthGuard><RootLayout /></AuthGuard>}>
            {DashboardRoutes}
            {TenantRoutes}
            {BillingRoutes}
            {FeatureRoutes}
            {UserRoutes}
            {SupportRoutes}
            {MonitorRoutes}
            {SecurityRoutes}
            {AiRoutes}
            {/* {IntegrationRoutes}
            {ReportRoutes}
            {SettingsRoutes} */}

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;