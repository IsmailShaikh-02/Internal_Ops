export type ModuleStatus = "active" | "inactive" | "archived";
export type AvailabilityStatus = "enabled" | "disabled";

export interface Module {
  id: string;
  name: string; // unique
  displayName: string;
  description: string;
  category: string;
  version: string;
  status: ModuleStatus;
  defaultAvailability: AvailabilityStatus;
  icon: string; // Lucide icon name string
  routeName: string;
  assignedPlans: string[]; // e.g. ["Starter", "Professional", "Business", "Enterprise"]
  tenantCount?: number;
  updatedAt: string;
}

export type RolloutOption = "everyone" | "plan" | "tenant" | "percentage" | "group";
export type FeatureStatus = "active" | "inactive";

export interface FeatureFlag {
  id: string;
  name: string; // unique within a module
  moduleName: string; // references module name
  status: FeatureStatus;
  rolloutOption: RolloutOption;
  rolloutPercentage: number; // 0 to 100
  targetPlans: string[];
  targetTenants: string[];
  targetGroups: string[];
  scheduleDate?: string; // ISO timestamp or date string
  releaseVersion?: string;
  lastUpdated: string;
}

export interface TenantOverride {
  id: string;
  tenantName: string;
  currentPlan: string;
  enabledFeatures: string[];
  disabledFeatures: string[];
  expiryDate?: string; // Optional expiry date string (YYYY-MM-DD)
  status: "active" | "expired";
}

export interface PlanFeatureMapping {
  planName: "Starter" | "Professional" | "Business" | "Enterprise";
  enabledModules: string[];
  enabledFeatures: string[];
  aiCredits: number;
  storage: number; // in GB
  userLimits: number;
}

export type ReleaseStatus = "draft" | "scheduled" | "active" | "paused" | "rolled_back";

export interface Release {
  id: string;
  versionNumber: string; // unique
  releaseDate: string; // YYYY-MM-DD
  status: ReleaseStatus;
  featuresIncluded: string[]; // array of feature flag names
  rolloutPercentage: number;
  releaseOwner: string;
  releaseNotes: string;
}
