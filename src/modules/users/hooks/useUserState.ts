// src/modules/users/hooks/useUserState.ts

import { create } from "zustand";
import type { User, Role, PermissionGroup, Permission, SecurityPolicies } from "../types";
import { mockUsers, mockRoles, mockPermissionGroups, mockPermissions, defaultSecurityPolicies } from "../data/mockData";

interface UserStore {
  users: User[];
  roles: Role[];
  permissionGroups: PermissionGroup[];
  permissions: Permission[];
  securityPolicy: SecurityPolicies;

  // User Actions
  createUser: (user: Omit<User, "id" | "status" | "lastLogin" | "accountCreatedDate">) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  suspendUser: (id: string) => void;
  activateUser: (id: string) => void;
  deleteUser: (id: string) => void;
  resetPassword: (id: string) => string; // Returns temporary password
  unlockAccount: (id: string) => void;
  forceLogout: (id: string) => void;
  resendInvitation: (id: string) => void;
  acceptInvitation: (id: string) => void;

  // Role Actions
  createRole: (role: Omit<Role, "id" | "status">) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  cloneRole: (id: string, newName: string) => void;
  archiveRole: (id: string) => void;

  // Permission Group Actions
  createGroup: (group: Omit<PermissionGroup, "id">) => void;
  updateGroup: (id: string, group: Partial<PermissionGroup>) => void;
  deleteGroup: (id: string) => void;

  // Role Assignment
  assignRoleAndGroups: (userId: string, roleId: string, groupIds: string[]) => void;

  // Security Policy
  updateSecurityPolicy: (policy: Partial<SecurityPolicies>) => void;
}

export const useUserState = create<UserStore>((set) => ({
  users: mockUsers,
  roles: mockRoles,
  permissionGroups: mockPermissionGroups,
  permissions: mockPermissions,
  securityPolicy: defaultSecurityPolicies,

  // User Actions
  createUser: (newU) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...newU,
          id: `u-${Date.now()}`,
          status: "pending",
          lastLogin: "Never",
          accountCreatedDate: new Date().toISOString().split("T")[0]
        }
      ]
    })),

  updateUser: (id, updatedU) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...updatedU } : u))
    })),

  suspendUser: (id) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: "suspended" as const } : u))
    })),

  activateUser: (id) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: "active" as const } : u))
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id)
    })),

  resetPassword: (id) => {
    // Generate a simple mock temp password
    const tempPass = `Temp!${Math.random().toString(36).slice(-8)}`;
    // In real app, we would save hashed. Here we just trigger action.
    return tempPass;
  },

  unlockAccount: (id) => {
    // Mock unlocking account, in real app, reset lock metadata
  },

  forceLogout: (id) => {
    // Force log out mock action
  },

  resendInvitation: (id) => {
    // Mock resending email invite
  },

  acceptInvitation: (id) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, status: "active" as const } : u))
    })),

  // Role Actions
  createRole: (newR) =>
    set((state) => ({
      roles: [
        ...state.roles,
        {
          ...newR,
          id: `r-${Date.now()}`,
          status: "active"
        }
      ]
    })),

  updateRole: (id, updatedR) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...updatedR } : r))
    })),

  cloneRole: (id, newName) =>
    set((state) => {
      const srcRole = state.roles.find((r) => r.id === id);
      if (!srcRole) return {};
      const cloned: Role = {
        ...srcRole,
        id: `r-${Date.now()}`,
        roleName: newName,
        status: "active"
      };
      return {
        roles: [...state.roles, cloned]
      };
    }),

  archiveRole: (id) =>
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, status: "archived" as const } : r))
    })),

  // Permission Group Actions
  createGroup: (newG) =>
    set((state) => ({
      permissionGroups: [
        ...state.permissionGroups,
        {
          ...newG,
          id: `g-${Date.now()}`
        }
      ]
    })),

  updateGroup: (id, updatedG) =>
    set((state) => ({
      permissionGroups: state.permissionGroups.map((g) => (g.id === id ? { ...g, ...updatedG } : g))
    })),

  deleteGroup: (id) =>
    set((state) => ({
      permissionGroups: state.permissionGroups.filter((g) => g.id !== id)
    })),

  // Role Assignment
  assignRoleAndGroups: (userId, roleId, groupIds) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              assignedRoleId: roleId,
              permissionGroupIds: groupIds
            }
          : u
      )
    })),

  // Security Policy
  updateSecurityPolicy: (updatedPolicy) =>
    set((state) => ({
      securityPolicy: {
        ...state.securityPolicy,
        ...updatedPolicy
      }
    }))
}));
