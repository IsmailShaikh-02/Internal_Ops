// src/modules/security/types/index.ts

export interface LoginRecord {
  id: string;
  userName: string;
  email: string;
  loginTime: string;
  logoutTime: string | null;
  ipAddress: string;
  device: string;
  browser: string;
  operatingSystem: string;
  location: string;
  authMethod: string;
}

export interface FailedLoginRecord {
  id: string;
  userName: string;
  email: string;
  ipAddress: string;
  failureReason: string;
  attemptCount: number;
  dateTime: string;
  device: string;
  status: "locked" | "active" | "investigating";
}

export interface ActiveSession {
  id: string;
  userName: string;
  email: string;
  loginTime: string;
  lastActivity: string;
  device: string;
  browser: string;
  ipAddress: string;
  duration: string;
}

export interface BlockedIP {
  id: string;
  ipAddress: string;
  reason: string;
  blockedBy: string;
  blockedDate: string;
  expiryDate: string | null;
  status: "active" | "expired";
}

export interface ImpersonationRecord {
  id: string;
  adminUser: string;
  targetUser: string;
  tenant: string;
  startTime: string;
  endTime: string | null;
  reason: string;
}

export interface AuditLogRecord {
  id: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
  browser: string;
  timestamp: string;
  previousValue: string | null;
  newValue: string | null;
  severity: "low" | "medium" | "high" | "critical";
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

export interface LoginPolicy {
  failedLoginLimit: number;
  accountLockDurationMinutes: number;
  captchaEnabled: boolean;
}

export interface SessionPolicy {
  sessionTimeoutMinutes: number;
  maxConcurrentSessions: number;
  autoLogoutEnabled: boolean;
}

export interface MfaPolicy {
  enabled: boolean;
  mandatoryRoles: string[];
  recoveryCodesEnabled: boolean;
  trustedDevicesEnabled: boolean;
  verificationFrequencyDays: number;
}

export interface IpPolicy {
  allowList: string[];
  blockList: string[];
  countryRestrictions: string[];
}

export interface SecurityPolicyConfig {
  passwordPolicy: PasswordPolicy;
  loginPolicy: LoginPolicy;
  sessionPolicy: SessionPolicy;
  mfaPolicy: MfaPolicy;
  ipPolicy: IpPolicy;
}
