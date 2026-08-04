import { create } from "zustand";
import type { Module, FeatureFlag, TenantOverride, PlanFeatureMapping, Release } from "../types";
import {
  mockModules,
  mockFeatureFlags,
  mockTenantOverrides,
  mockPlanMappings,
  mockReleases
} from "../data/mockData";

interface FeatureStore {
  modules: Module[];
  featureFlags: FeatureFlag[];
  tenantOverrides: TenantOverride[];
  planMappings: PlanFeatureMapping[];
  releases: Release[];

  // Module Actions
  addModule: (module: Omit<Module, "id" | "updatedAt" | "tenantCount">) => void;
  updateModule: (id: string, module: Partial<Module>) => void;
  archiveModule: (id: string) => void;
  toggleModuleStatus: (id: string) => void;

  // Feature Flag Actions
  addFeatureFlag: (flag: Omit<FeatureFlag, "id" | "lastUpdated">) => void;
  updateFeatureFlag: (id: string, flag: Partial<FeatureFlag>) => void;
  toggleFeatureFlagStatus: (id: string) => void;
  cloneFeatureFlag: (id: string, newName: string) => void;

  // Tenant Override Actions
  addTenantOverride: (override: Omit<TenantOverride, "id">) => void;
  removeTenantOverride: (id: string) => void;
  expireTenantOverride: (id: string) => void;

  // Plan Feature Mapping Actions
  updatePlanMapping: (planName: PlanFeatureMapping["planName"], mapping: Partial<PlanFeatureMapping>) => void;
  copyPlanMapping: (fromPlan: PlanFeatureMapping["planName"], toPlan: PlanFeatureMapping["planName"]) => void;

  // Release Management Actions
  createRelease: (release: Omit<Release, "id">) => void;
  publishRelease: (id: string) => void;
  pauseRelease: (id: string) => void;
  resumeRelease: (id: string) => void;
  rollbackRelease: (id: string) => void;
  applyKillSwitch: (id: string) => void;
}

export const useFeatureStore = create<FeatureStore>((set) => ({
  modules: mockModules,
  featureFlags: mockFeatureFlags,
  tenantOverrides: mockTenantOverrides,
  planMappings: mockPlanMappings,
  releases: mockReleases,

  // Module Actions
  addModule: (newMod) =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          ...newMod,
          id: `mod-${Date.now()}`,
          tenantCount: 0,
          updatedAt: "Just now",
        },
      ],
    })),

  updateModule: (id, updatedMod) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, ...updatedMod, updatedAt: "Just now" } : m
      ),
    })),

  archiveModule: (id) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id ? { ...m, status: "archived" as const, updatedAt: "Just now" } : m
      ),
    })),

  toggleModuleStatus: (id) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === "active" ? ("inactive" as const) : ("active" as const),
              updatedAt: "Just now",
            }
          : m
      ),
    })),

  // Feature Flag Actions
  addFeatureFlag: (newFlag) =>
    set((state) => ({
      featureFlags: [
        ...state.featureFlags,
        {
          ...newFlag,
          id: `flag-${Date.now()}`,
          lastUpdated: "Just now",
        },
      ],
    })),

  updateFeatureFlag: (id, updatedFlag) =>
    set((state) => ({
      featureFlags: state.featureFlags.map((f) =>
        f.id === id ? { ...f, ...updatedFlag, lastUpdated: "Just now" } : f
      ),
    })),

  toggleFeatureFlagStatus: (id) =>
    set((state) => ({
      featureFlags: state.featureFlags.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "active" ? ("inactive" as const) : ("active" as const),
              lastUpdated: "Just now",
            }
          : f
      ),
    })),

  cloneFeatureFlag: (id, newName) =>
    set((state) => {
      const srcFlag = state.featureFlags.find((f) => f.id === id);
      if (!srcFlag) return {};
      const cloned: FeatureFlag = {
        ...srcFlag,
        id: `flag-${Date.now()}`,
        name: newName,
        lastUpdated: "Just now",
      };
      return {
        featureFlags: [...state.featureFlags, cloned],
      };
    }),

  // Tenant Override Actions
  addTenantOverride: (newOverride) =>
    set((state) => ({
      tenantOverrides: [
        ...state.tenantOverrides,
        {
          ...newOverride,
          id: `override-${Date.now()}`,
        },
      ],
    })),

  removeTenantOverride: (id) =>
    set((state) => ({
      tenantOverrides: state.tenantOverrides.filter((o) => o.id !== id),
    })),

  expireTenantOverride: (id) =>
    set((state) => ({
      tenantOverrides: state.tenantOverrides.map((o) =>
        o.id === id ? { ...o, status: "expired" as const } : o
      ),
    })),

  // Plan Feature Mapping Actions
  updatePlanMapping: (planName, updatedMapping) =>
    set((state) => ({
      planMappings: state.planMappings.map((pm) =>
        pm.planName === planName ? { ...pm, ...updatedMapping } : pm
      ),
    })),

  copyPlanMapping: (fromPlan, toPlan) =>
    set((state) => {
      const srcMapping = state.planMappings.find((pm) => pm.planName === fromPlan);
      if (!srcMapping) return {};
      return {
        planMappings: state.planMappings.map((pm) =>
          pm.planName === toPlan
            ? {
                ...pm,
                enabledModules: [...srcMapping.enabledModules],
                enabledFeatures: [...srcMapping.enabledFeatures],
                aiCredits: srcMapping.aiCredits,
                storage: srcMapping.storage,
                userLimits: srcMapping.userLimits,
              }
            : pm
        ),
      };
    }),

  // Release Management Actions
  createRelease: (newRelease) =>
    set((state) => ({
      releases: [
        ...state.releases,
        {
          ...newRelease,
          id: `rel-${Date.now()}`,
        },
      ],
    })),

  publishRelease: (id) =>
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, status: "active" as const, rolloutPercentage: 100 } : r
      ),
    })),

  pauseRelease: (id) =>
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, status: "paused" as const } : r
      ),
    })),

  resumeRelease: (id) =>
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, status: "active" as const } : r
      ),
    })),

  rollbackRelease: (id) =>
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id ? { ...r, status: "rolled_back" as const, rolloutPercentage: 0 } : r
      ),
    })),

  applyKillSwitch: (id) =>
    set((state) => ({
      releases: state.releases.map((r) =>
        r.id === id && r.status === "active"
          ? { ...r, status: "rolled_back" as const, rolloutPercentage: 0 }
          : r
      ),
    })),
}));
