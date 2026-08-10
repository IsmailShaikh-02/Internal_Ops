// src/modules/monitor/components/MonitoringLayout.tsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/layout/PageHeader";

interface MonitoringLayoutProps {
  children: React.ReactNode;
}

interface TabItem {
  label: string;
  path: string;
}

const tabItems: TabItem[] = [
  { label: "System Health", path: "/monitoring/health" },
  { label: "Server Monitoring", path: "/monitoring/server" },
  { label: "API Monitoring", path: "/monitoring/api" },
  { label: "Queue Monitoring", path: "/monitoring/queue" },
  { label: "Redis Monitoring", path: "/monitoring/redis" },
  { label: "Storage Monitoring", path: "/monitoring/storage" },
  { label: "Database Monitoring", path: "/monitoring/database" },
  { label: "Background Jobs", path: "/monitoring/background-jobs" },
  { label: "Scheduler", path: "/monitoring/scheduler" },
  { label: "Error Logs", path: "/monitoring/error-logs" },
  { label: "Application Logs", path: "/monitoring/app-logs" },
  { label: "Live Logs", path: "/monitoring/live-logs" },
];

export function MonitoringLayout({ children }: MonitoringLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Find active tab or default to first
  const activeTab = tabItems.find((tab) => location.pathname === tab.path) || tabItems[0];

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Monitoring" },
          { label: activeTab.label },
        ]}
        title="Monitoring"
        description="Real-time system health, infrastructure and logs across all regions."
      />

      {/* Tabs Selection Area */}
      <div className="border-b border-slate-200">
  <nav className="flex flex-nowrap md:flex-wrap gap-x-8 gap-y-0 overflow-x-auto md:overflow-x-visible scrollbar-hide">
          {tabItems.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-slate-900 text-slate-950 font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
