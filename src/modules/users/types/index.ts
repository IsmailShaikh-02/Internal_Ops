// src/modules/users/types/index.ts

export type UserStatus = "active" | "suspended" | "pending";

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  department: string;
  designation: string;
  assignedRoleId: string;
  permissionGroupIds: string[];
  status: UserStatus;
  lastLogin: string;
  mfaStatus: "Enabled" | "Disabled";
  accountCreatedDate: string;
}

export interface Role {
  id: string;
  roleName: string;
  description: string;
  status: "active" | "archived";
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissionIds: string[]; // Reference individual permission IDs
}

export interface Permission {
  id: string;
  code: string; // e.g. "Tenant.View"
  moduleName: string; // e.g. "Tenant Module"
  description: string;
  type: "View" | "Create" | "Update" | "Delete" | "Export" | "Approve" | "Configure";
}

export interface PasswordPolicy {
  minimumLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  expiryDays: number;
  historyCount: number;
}

export interface MfaPolicy {
  enabled: boolean;
  mandatoryByRole: string[]; // Role IDs
  recoveryCodesEnabled: boolean;
}

export interface SessionPolicy {
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  rememberMeDurationDays: number;
}

export interface InvitationPolicy {
  invitationExpiryHours: number;
  inviteApprovalRequired: boolean;
  emailVerificationRequired: boolean;
}

export interface LoginPolicy {
  failedLoginLimit: number;
  accountLockDurationMinutes: number;
  captchaEnabled: boolean;
}

export interface SecurityPolicies {
  passwordPolicy: PasswordPolicy;
  mfaPolicy: MfaPolicy;
  sessionPolicy: SessionPolicy;
  invitationPolicy: InvitationPolicy;
  loginPolicy: LoginPolicy;
}
