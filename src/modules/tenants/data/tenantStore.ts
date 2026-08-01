import { create } from "zustand";
import { type Tenant, initialTenants } from "./mockTenants";

interface TenantStore {
  tenants: Tenant[];
  updateTenant: (id: string, updated: Partial<Tenant>) => void;
  updateTenantModules: (id: string, modules: Tenant["modules"]) => void;
  addTenant: (tenant: Tenant) => void;
}

export const useTenantStore = create<TenantStore>((set) => ({
  tenants: initialTenants,
  updateTenant: (id, updated) =>
    set((state) => ({
      tenants: state.tenants.map((t) => (t.id === id ? { ...t, ...updated } : t)),
    })),
  updateTenantModules: (id, modules) =>
    set((state) => ({
      tenants: state.tenants.map((t) => (t.id === id ? { ...t, modules } : t)),
    })),
  addTenant: (tenant) =>
    set((state) => ({
      tenants: [...state.tenants, tenant],
    })),
}));
