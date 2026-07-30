import { lazy } from 'react';
import { Route } from 'react-router-dom';

const DashboardPage = lazy(() => import('@/modules/dashboard/pages/DashboardPage'));

export const DashboardRoutes = (
  <Route path="/" element={<DashboardPage />} />
);