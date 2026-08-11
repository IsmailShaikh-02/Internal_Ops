// src/modules/security/pages/SecurityLayout.tsx

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function SecurityLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Dashboard", path: "/security" },
    { name: "Login History", path: "/security/login-history" },
    { name: "Failed Logins", path: "/security/failed-logins" },
    { name: "Active Sessions", path: "/security/active-sessions" },
    { name: "Blocked IPs", path: "/security/blocked-ips" },
    { name: "User Impersonation", path: "/security/impersonation" },
    { name: "MFA Settings", path: "/security/mfa" },
    { name: "Audit Logs", path: "/security/audit-logs" },
    { name: "Security Policies", path: "/security/policies" },
  ];

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Security Management" },
        ]}
        title="Security Management"
        description="Monitor system authentication, active sessions, block list regulations, user impersonation, and policy controls."
      />

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
  <nav className="flex flex-nowrap md:flex-wrap gap-x-8 gap-y-0 overflow-x-auto md:overflow-x-visible scrollbar-hide">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === "/security" && location.pathname === "/security/");
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition duration-150 relative cursor-pointer ${
                  isActive
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default SecurityLayout;
