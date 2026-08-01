import TenantPage from '@/modules/tenants/pages/TenantPage';
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const CreateTenantPage = lazy(() => import('@/modules/tenants/pages/CreateTenantPage'));
const TenantDetailPage = lazy(() => import('@/modules/tenants/pages/TenantDetailPage'));
const ActivityPage = lazy(() => import('@/modules/tenants/pages/ActivityPage'));
const AuditPage = lazy(() => import('@/modules/tenants/pages/AuditPage'));

export const TenantRoutes = (
  <Route path="tenants">
    <Route index element={<TenantPage />} />
    <Route path="create" element={<CreateTenantPage />} />
    <Route path="activity" element={<ActivityPage />} />
    <Route path="audit" element={<AuditPage />} />
    <Route path=":id" element={<TenantDetailPage />} />
  </Route>
);