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
    children: [],
  },

  {
    id: "monitoring",
    title: "Monitoring",
    icon: Activity,
    path: "/monitoring",
    children: [],
  },

  {
    id: "security",
    title: "Security",
    icon: Shield,
    path: "/security",
    children: [],
  },

  {
    id: "ai",
    title: "AI Administration",
    icon: Bot,
    path: "/ai",
    children: [],
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