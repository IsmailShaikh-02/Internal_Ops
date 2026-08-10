// src/routes/Monitor.tsx

import { lazy } from "react";
import { Route, Navigate } from "react-router-dom";

const SystemHealthPage = lazy(() => import("@/modules/monitor/pages/SystemHealthPage"));
const ServerMonitoringPage = lazy(() => import("@/modules/monitor/pages/ServerMonitoringPage"));
const ApiMonitoringPage = lazy(() => import("@/modules/monitor/pages/ApiMonitoringPage"));
const QueueMonitoringPage = lazy(() => import("@/modules/monitor/pages/QueueMonitoringPage"));
const RedisMonitoringPage = lazy(() => import("@/modules/monitor/pages/RedisMonitoringPage"));
const StorageMonitoringPage = lazy(() => import("@/modules/monitor/pages/StorageMonitoringPage"));
const DatabaseMonitoringPage = lazy(() => import("@/modules/monitor/pages/DatabaseMonitoringPage"));
const BackgroundJobsPage = lazy(() => import("@/modules/monitor/pages/BackgroundJobsPage"));
const SchedulerPage = lazy(() => import("@/modules/monitor/pages/SchedulerPage"));
const ErrorLogsPage = lazy(() => import("@/modules/monitor/pages/ErrorLogsPage"));
const ApplicationLogsPage = lazy(() => import("@/modules/monitor/pages/ApplicationLogsPage"));
const LiveLogsPage = lazy(() => import("@/modules/monitor/pages/LiveLogsPage"));

export const MonitorRoutes = (
  <Route path="monitoring">
    <Route index element={<Navigate to="health" replace />} />
    <Route path="health" element={<SystemHealthPage />} />
    <Route path="server" element={<ServerMonitoringPage />} />
    <Route path="api" element={<ApiMonitoringPage />} />
    <Route path="queue" element={<QueueMonitoringPage />} />
    <Route path="redis" element={<RedisMonitoringPage />} />
    <Route path="storage" element={<StorageMonitoringPage />} />
    <Route path="database" element={<DatabaseMonitoringPage />} />
    <Route path="background-jobs" element={<BackgroundJobsPage />} />
    <Route path="scheduler" element={<SchedulerPage />} />
    <Route path="error-logs" element={<ErrorLogsPage />} />
    <Route path="app-logs" element={<ApplicationLogsPage />} />
    <Route path="live-logs" element={<LiveLogsPage />} />
  </Route>
);

export default MonitorRoutes;
