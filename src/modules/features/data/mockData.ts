import type { Module, FeatureFlag, TenantOverride, PlanFeatureMapping, Release } from "../types";

export const mockModules: Module[] = [
  {
    id: "mod-1",
    name: "HR",
    displayName: "HR Module",
    description: "Manage employee records, recruiting, and time-off tracking.",
    category: "Human Resources",
    version: "v2024.10",
    status: "active",
    defaultAvailability: "enabled",
    icon: "Users",
    routeName: "/hr",
    assignedPlans: ["Starter", "Professional", "Business", "Enterprise"],
    tenantCount: 40,
    updatedAt: "1d ago"
  },
  {
    id: "mod-2",
    name: "Finance",
    displayName: "Finance Module",
    description: "Multi-currency invoicing, ledger mapping, and expense reports.",
    category: "Finance",
    version: "v2024.11",
    status: "active",
    defaultAvailability: "enabled",
    icon: "CreditCard",
    routeName: "/finance",
    assignedPlans: ["Professional", "Business", "Enterprise"],
    tenantCount: 52,
    updatedAt: "2d ago"
  },
  {
    id: "mod-3",
    name: "CRM",
    displayName: "CRM Module",
    description: "Sales funnel, pipeline forecasting, and contact management.",
    category: "Sales & Marketing",
    version: "v2024.12",
    status: "active",
    defaultAvailability: "disabled",
    icon: "Target",
    routeName: "/crm",
    assignedPlans: ["Business", "Enterprise"],
    tenantCount: 64,
    updatedAt: "3d ago"
  },
  {
    id: "mod-4",
    name: "Inventory",
    displayName: "Inventory Module",
    description: "Stock tracking, auto-reordering, and warehouse management.",
    category: "Supply Chain",
    version: "v2024.13",
    status: "inactive",
    defaultAvailability: "disabled",
    icon: "Warehouse",
    routeName: "/inventory",
    assignedPlans: ["Enterprise"],
    tenantCount: 76,
    updatedAt: "4d ago"
  },
  {
    id: "mod-5",
    name: "Projects",
    displayName: "Projects Module",
    description: "Task boards, Gantt charts, and resource allocation.",
    category: "Operations",
    version: "v2024.14",
    status: "active",
    defaultAvailability: "enabled",
    icon: "Calendar",
    routeName: "/projects",
    assignedPlans: ["Starter", "Professional", "Business", "Enterprise"],
    tenantCount: 88,
    updatedAt: "5d ago"
  },
  {
    id: "mod-6",
    name: "Docs",
    displayName: "Docs Module",
    description: "Real-time document editing, wiki pages, and PDF generation.",
    category: "Collaboration",
    version: "v2024.15",
    status: "active",
    defaultAvailability: "enabled",
    icon: "FileText",
    routeName: "/docs",
    assignedPlans: ["Starter", "Professional", "Business", "Enterprise"],
    tenantCount: 100,
    updatedAt: "6d ago"
  }
];

export const mockFeatureFlags: FeatureFlag[] = [
  {
    id: "flag-1",
    name: "AI Resume Screener",
    moduleName: "HR",
    status: "active",
    rolloutOption: "percentage",
    rolloutPercentage: 25,
    targetPlans: ["Business", "Enterprise"],
    targetTenants: [],
    targetGroups: [],
    lastUpdated: "12h ago"
  },
  {
    id: "flag-2",
    name: "Multi-currency Invoicing",
    moduleName: "Finance",
    status: "active",
    rolloutOption: "plan",
    rolloutPercentage: 100,
    targetPlans: ["Business", "Enterprise"],
    targetTenants: [],
    targetGroups: [],
    lastUpdated: "1d ago"
  },
  {
    id: "flag-3",
    name: "CRM Pipeline V2",
    moduleName: "CRM",
    status: "inactive",
    rolloutOption: "group",
    rolloutPercentage: 0,
    targetPlans: [],
    targetTenants: [],
    targetGroups: ["Beta Testers"],
    lastUpdated: "2d ago"
  },
  {
    id: "flag-4",
    name: "Auto Stock Reorder",
    moduleName: "Inventory",
    status: "inactive",
    rolloutOption: "tenant",
    rolloutPercentage: 0,
    targetPlans: [],
    targetTenants: ["Acme Corp", "Globex Inc"],
    targetGroups: [],
    lastUpdated: "3d ago"
  },
  {
    id: "flag-5",
    name: "Project Gantt Charts",
    moduleName: "Projects",
    status: "active",
    rolloutOption: "everyone",
    rolloutPercentage: 100,
    targetPlans: [],
    targetTenants: [],
    targetGroups: [],
    lastUpdated: "5h ago"
  }
];

export const mockTenantOverrides: TenantOverride[] = [
  {
    id: "override-1",
    tenantName: "Acme Corp",
    currentPlan: "Professional",
    enabledFeatures: ["AI Resume Screener", "CRM Pipeline V2"],
    disabledFeatures: [],
    expiryDate: "2026-12-31",
    status: "active"
  },
  {
    id: "override-2",
    tenantName: "Globex Inc",
    currentPlan: "Starter",
    enabledFeatures: ["Project Gantt Charts"],
    disabledFeatures: ["AI Resume Screener"],
    expiryDate: "2026-09-30",
    status: "active"
  },
  {
    id: "override-3",
    tenantName: "Initech",
    currentPlan: "Business",
    enabledFeatures: ["CRM Pipeline V2"],
    disabledFeatures: [],
    status: "active"
  }
];

export const mockPlanMappings: PlanFeatureMapping[] = [
  {
    planName: "Starter",
    enabledModules: ["HR", "Projects", "Docs"],
    enabledFeatures: ["Project Gantt Charts"],
    aiCredits: 100,
    storage: 10,
    userLimits: 5
  },
  {
    planName: "Professional",
    enabledModules: ["HR", "Finance", "Projects", "Docs"],
    enabledFeatures: ["Project Gantt Charts", "AI Resume Screener"],
    aiCredits: 500,
    storage: 50,
    userLimits: 20
  },
  {
    planName: "Business",
    enabledModules: ["HR", "Finance", "CRM", "Projects", "Docs"],
    enabledFeatures: ["Project Gantt Charts", "AI Resume Screener", "Multi-currency Invoicing"],
    aiCredits: 2000,
    storage: 200,
    userLimits: 100
  },
  {
    planName: "Enterprise",
    enabledModules: ["HR", "Finance", "CRM", "Inventory", "Projects", "Docs"],
    enabledFeatures: ["Project Gantt Charts", "AI Resume Screener", "Multi-currency Invoicing", "CRM Pipeline V2", "Auto Stock Reorder"],
    aiCredits: 10000,
    storage: 1000,
    userLimits: 9999
  }
];

export const mockReleases: Release[] = [
  {
    id: "rel-1",
    versionNumber: "v2.6.0",
    releaseDate: "2026-07-01",
    status: "active",
    featuresIncluded: ["Project Gantt Charts"],
    rolloutPercentage: 100,
    releaseOwner: "Ada Turing",
    releaseNotes: "Rolled out Gantt charts for Projects module globally."
  },
  {
    id: "rel-2",
    versionNumber: "v2.6.1",
    releaseDate: "2026-07-25",
    status: "active",
    featuresIncluded: ["AI Resume Screener"],
    rolloutPercentage: 25,
    releaseOwner: "Ada Turing",
    releaseNotes: "Initial gradual rollout of AI Resume Screener."
  },
  {
    id: "rel-3",
    versionNumber: "v2.6.2",
    releaseDate: "2026-08-15",
    status: "scheduled",
    featuresIncluded: ["Multi-currency Invoicing"],
    rolloutPercentage: 0,
    releaseOwner: "Ada Turing",
    releaseNotes: "Upcoming release of multi-currency invoice rendering."
  }
];
