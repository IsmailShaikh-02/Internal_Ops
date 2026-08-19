import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Boxes,
  Users,
  Headset,
  Activity,
  Shield,
  Bot,
  Plug,
  FileBarChart2,
  Settings,
} from "lucide-react";

export interface NavigationItem {
  title: string;
  path: string;
  group?: string;
}

export interface NavigationModule {
  id: string;
  title: string;
  icon: typeof LayoutDashboard;
  path: string;
  children: NavigationItem[];
}

export const navigation: NavigationModule[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
    children: [
      {
        title: "Overview",
        path: "/",
      },
    ],
  },

  {
    id: "tenants",
    title: "Tenant Management",
    icon: Building2,
    path: "/tenants",
    children: [
      { title: "All Tenants", path: "/tenants" },
      { title: "Create Tenant", path: "/tenants/create" },
      { title: "Activity", path: "/tenants/activity" },
      { title: "Audit", path: "/tenants/audit" },
    ],
  },

  {
    id: "billing",
    title: "Subscription & Billing",
    icon: CreditCard,
    path: "/billing",
    children: [
      { title: "Plans", path: "/billing/plans", group: "CATALOG" },
      { title: "Plan Comparison", path: "/billing/comparison", group: "CATALOG" },
      { title: "Coupons", path: "/billing/coupons", group: "CATALOG" },
      { title: "Taxes", path: "/billing/taxes", group: "CATALOG" },
      { title: "Subscriptions", path: "/billing/subscriptions", group: "MONEY" },
      { title: "Invoices", path: "/billing/invoices", group: "MONEY" },
      { title: "Payments", path: "/billing/payments", group: "MONEY" },
      { title: "Refunds", path: "/billing/refunds", group: "MONEY" },
      { title: "Revenue Dashboard", path: "/billing/dashboard", group: "ANALYTICS" },
      { title: "Revenue Reports", path: "/billing/reports", group: "ANALYTICS" },
    ],
  },

  {
    id: "features",
    title: "Feature Management",
    icon: Boxes,
    path: "/features",
    children: [
      { title: "Modules", path: "/features/modules", group: "PRODUCT" },
      { title: "Feature Flags", path: "/features/flags", group: "PRODUCT" },
      { title: "Tenant Overrides", path: "/features/overrides", group: "PRODUCT" },
      { title: "Plan Feature Mapping", path: "/features/plans", group: "PRODUCT" },
      { title: "Release Management", path: "/features/releases", group: "PRODUCT" },
    ],
  },

  {
    id: "users",
    title: "Platform Users",
    icon: Users,
    path: "/users",
    children: [
      { title: "Users", path: "/users", group: "PEOPLE" },
      { title: "Roles", path: "/users/roles", group: "PEOPLE" },
      { title: "Permission Groups", path: "/users/permission-groups", group: "PEOPLE" },
      { title: "Permissions", path: "/users/permissions", group: "PEOPLE" },
      { title: "Role Assignment", path: "/users/role-assignment", group: "PEOPLE" },
      { title: "Security Policies", path: "/users/security-policies", group: "GOVERNANCE" },
    ],
  },

  {
    id: "support",
    title: "Support Center",
    icon: Headset,
    path: "/support",
    children: [
      { title: "Support Dashboard", path: "/support/dashboard", group: "QUEUES" },
      { title: "Support Tickets", path: "/support/tickets", group: "QUEUES" },
      { title: "Bug Reports", path: "/support/bugs", group: "QUEUES" },
      { title: "Feature Requests", path: "/support/features", group: "QUEUES" },
      { title: "Customer Requests", path: "/support/customer-requests", group: "QUEUES" },
      { title: "Announcements", path: "/support/announcements", group: "CONTENT" },
      { title: "Knowledge Articles", path: "/support/knowledge", group: "CONTENT" },
    ],
  },

  {
    id: "monitoring",
    title: "Monitoring",
    icon: Activity,
    path: "/monitoring",
    children: [
      { title: "System Health", path: "/monitoring/health", group: "INFRASTRUCTURE" },
      { title: "Server Monitoring", path: "/monitoring/server", group: "INFRASTRUCTURE" },
      { title: "API Monitoring", path: "/monitoring/api", group: "INFRASTRUCTURE" },
      { title: "Queue Monitoring", path: "/monitoring/queue", group: "INFRASTRUCTURE" },
      { title: "Redis Monitoring", path: "/monitoring/redis", group: "INFRASTRUCTURE" },
      { title: "Storage Monitoring", path: "/monitoring/storage", group: "INFRASTRUCTURE" },
      { title: "Database Monitoring", path: "/monitoring/database", group: "INFRASTRUCTURE" },
      { title: "Background Jobs", path: "/monitoring/background-jobs", group: "JOBS & LOGS" },
      { title: "Scheduler", path: "/monitoring/scheduler", group: "JOBS & LOGS" },
      { title: "Error Logs", path: "/monitoring/error-logs", group: "JOBS & LOGS" },
      { title: "Application Logs", path: "/monitoring/app-logs", group: "JOBS & LOGS" },
      { title: "Live Logs", path: "/monitoring/live-logs", group: "JOBS & LOGS" },
    ],
  },

  {
    id: "security",
    title: "Security",
    icon: Shield,
    path: "/security",
    children: [
      { title: "Security Dashboard", path: "/security", group: "ACCESS" },
      { title: "Login History", path: "/security/login-history", group: "ACCESS" },
      { title: "Failed Logins", path: "/security/failed-logins", group: "ACCESS" },
      { title: "Active Sessions", path: "/security/active-sessions", group: "ACCESS" },
      { title: "Blocked IPs", path: "/security/blocked-ips", group: "ACCESS" },
      { title: "User Impersonation", path: "/security/impersonation", group: "ACCESS" },
      { title: "Multi-Factor Authentication", path: "/security/mfa", group: "ACCESS" },
      { title: "Audit Logs", path: "/security/audit-logs", group: "GOVERNANCE" },
      { title: "Security Policies", path: "/security/policies", group: "GOVERNANCE" },
    ],
  },

  {
    id: "ai",
    title: "AI Administration",
    icon: Bot,
    path: "/ai",
    children: [
      { title: "AI Dashboard", path: "/ai/dashboard", group: "USAGE" },
      { title: "AI Usage", path: "/ai/usage", group: "USAGE" },
      { title: "Token Usage", path: "/ai/token-usage", group: "USAGE" },
      { title: "AI Analytics", path: "/ai/analytics", group: "USAGE" },
      { title: "Cost Analytics", path: "/ai/cost-analytics", group: "USAGE" },
      { title: "Prompt Library", path: "/ai/prompt-library", group: "CONFIGURATION" },
      { title: "Prompt Templates", path: "/ai/prompt-templates", group: "CONFIGURATION" },
      { title: "Model Configuration", path: "/ai/model-configuration", group: "CONFIGURATION" },
    ],
  },

  {
    id: "integrations",
    title: "Integrations",
    icon: Plug,
    path: "/integrations",
    children: [],
  },

  {
    id: "reports",
    title: "Reports",
    icon: FileBarChart2,
    path: "/reports",
    children: [],
  },

  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    path: "/settings",
    children: [],
  },
];