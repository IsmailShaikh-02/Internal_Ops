// src/modules/users/data/mockData.ts

import type { User, Role, PermissionGroup, Permission, SecurityPolicies } from "../types";

export const mockPermissions: Permission[] = [
  // Tenant module
  { id: "p1", code: "Tenant.View", moduleName: "Tenant Module", description: "View tenant listings and detailed profiles", type: "View" },
  { id: "p2", code: "Tenant.Create", moduleName: "Tenant Module", description: "Provision new tenant accounts", type: "Create" },
  { id: "p3", code: "Tenant.Update", moduleName: "Tenant Module", description: "Update tenant configurations and metadata", type: "Update" },
  { id: "p4", code: "Tenant.Delete", moduleName: "Tenant Module", description: "Deprovision/delete tenant accounts", type: "Delete" },
  
  // Billing module
  { id: "p5", code: "Billing.View", moduleName: "Billing Module", description: "View billing, subscription plans and invoices", type: "View" },
  { id: "p6", code: "Billing.ManagePlans", moduleName: "Billing Module", description: "Create, update and configure pricing plans", type: "Configure" },
  { id: "p7", code: "Billing.ManageInvoices", moduleName: "Billing Module", description: "Issue refunds, void invoices, modify parameters", type: "Update" },
  { id: "p8", code: "Billing.ApproveRefund", moduleName: "Billing Module", description: "Approve premium refunds above threshold", type: "Approve" },
  
  // User Management
  { id: "p9", code: "User.View", moduleName: "User Management", description: "View platform administrator list and logs", type: "View" },
  { id: "p10", code: "User.Create", moduleName: "User Management", description: "Invite new console administrators", type: "Create" },
  { id: "p11", code: "User.Update", moduleName: "User Management", description: "Edit roles, groups and status of users", type: "Update" },
  { id: "p12", code: "User.Delete", moduleName: "User Management", description: "Delete platform users", type: "Delete" },
  
  // Security
  { id: "p13", code: "Security.Configure", moduleName: "Security Policies", description: "Configure system-wide login and MFA parameters", type: "Configure" },
  { id: "p14", code: "Security.AuditLog", moduleName: "Security Policies", description: "Export and view raw security trail data", type: "Export" },
];

export const mockRoles: Role[] = [
  { id: "r1", roleName: "Platform Owner", description: "Full, unrestricted administrative control of the InternalOps platform.", status: "active" },
  { id: "r2", roleName: "Super Administrator", description: "System-wide operations except platform ownership transfer.", status: "active" },
  { id: "r3", roleName: "HR Administrator", description: "Manage platform users, departments, and user assignments.", status: "active" },
  { id: "r4", roleName: "Finance Administrator", description: "Manage subscriptions, plans, tax settings and issue refunds.", status: "active" },
  { id: "r5", roleName: "Support Administrator", description: "Access support tools, view tenant logs and assist customers.", status: "active" },
  { id: "r6", roleName: "Auditor", description: "Read-only access to all system activity, billing and security audit trails.", status: "active" },
];

export const mockPermissionGroups: PermissionGroup[] = [
  {
    id: "g1",
    name: "Tenant Management",
    description: "Permissions required to view and configure customer organisations.",
    permissionIds: ["p1", "p2", "p3"]
  },
  {
    id: "g2",
    name: "Billing Management",
    description: "Permissions representing financial operations including plan configurations.",
    permissionIds: ["p5", "p6", "p7", "p8"]
  },
  {
    id: "g3",
    name: "User Management",
    description: "Permissions related to platform administrator user lifecycle.",
    permissionIds: ["p9", "p10", "p11", "p12"]
  },
  {
    id: "g4",
    name: "Monitoring & Security",
    description: "Permissions needed to configure authentication rules and download audits.",
    permissionIds: ["p13", "p14"]
  }
];

export const mockUsers: User[] = [
  {
    id: "u1",
    fullName: "Sarah Connor",
    email: "sarah.connor@internalops.com",
    mobileNumber: "+1 (555) 019-2834",
    department: "Executive",
    designation: "Platform Owner",
    assignedRoleId: "r1",
    permissionGroupIds: ["g1", "g2", "g3", "g4"],
    status: "active",
    lastLogin: "2026-08-06 10:15 AM",
    mfaStatus: "Enabled",
    accountCreatedDate: "2026-01-10"
  },
  {
    id: "u2",
    fullName: "John Doe",
    email: "john.doe@internalops.com",
    mobileNumber: "+1 (555) 014-9988",
    department: "Operations",
    designation: "Super Admin",
    assignedRoleId: "r2",
    permissionGroupIds: ["g1", "g3"],
    status: "active",
    lastLogin: "2026-08-05 04:30 PM",
    mfaStatus: "Enabled",
    accountCreatedDate: "2026-02-15"
  },
  {
    id: "u3",
    fullName: "Alice Vance",
    email: "alice.vance@internalops.com",
    mobileNumber: "+1 (555) 012-3456",
    department: "Finance",
    designation: "Billing Manager",
    assignedRoleId: "r4",
    permissionGroupIds: ["g2"],
    status: "active",
    lastLogin: "2026-08-06 09:00 AM",
    mfaStatus: "Enabled",
    accountCreatedDate: "2026-03-01"
  },
  {
    id: "u4",
    fullName: "Bob Miller",
    email: "bob.miller@internalops.com",
    mobileNumber: "+1 (555) 017-6543",
    department: "Support",
    designation: "Tier 2 Specialist",
    assignedRoleId: "r5",
    permissionGroupIds: ["g1"],
    status: "pending",
    lastLogin: "Never",
    mfaStatus: "Disabled",
    accountCreatedDate: "2026-08-04"
  },
  {
    id: "u5",
    fullName: "Grace Hopper",
    email: "grace.hopper@internalops.com",
    mobileNumber: "+1 (555) 015-8811",
    department: "Compliance",
    designation: "Lead Auditor",
    assignedRoleId: "r6",
    permissionGroupIds: [],
    status: "suspended",
    lastLogin: "2026-07-20 11:15 AM",
    mfaStatus: "Enabled",
    accountCreatedDate: "2026-01-20"
  }
];

export const defaultSecurityPolicies: SecurityPolicies = {
  passwordPolicy: {
    minimumLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    historyCount: 5,
  },
  mfaPolicy: {
    enabled: true,
    mandatoryByRole: ["r1", "r2"],
    recoveryCodesEnabled: true,
  },
  sessionPolicy: {
    sessionTimeoutMinutes: 15,
    maxConcurrentSessions: 3,
    rememberMeDurationDays: 30,
  },
  invitationPolicy: {
    invitationExpiryHours: 48,
    inviteApprovalRequired: true,
    emailVerificationRequired: true,
  },
  loginPolicy: {
    failedLoginLimit: 5,
    accountLockDurationMinutes: 30,
    captchaEnabled: false,
  }
};
