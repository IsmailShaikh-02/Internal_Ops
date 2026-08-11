// src/modules/security/data/mockData.ts
import type {
  LoginRecord,
  FailedLoginRecord,
  ActiveSession,
  BlockedIP,
  ImpersonationRecord,
  AuditLogRecord,
  SecurityPolicyConfig
} from "../types";

export const mockLogins: LoginRecord[] = [
  {
    id: "log-1",
    userName: "Ada Turing",
    email: "ada@internalops.com",
    loginTime: "2026-08-11 11:30:15",
    logoutTime: null,
    ipAddress: "192.168.1.50",
    device: "MacBook Pro 16",
    browser: "Safari",
    operatingSystem: "macOS Sequoia",
    location: "San Francisco, US",
    authMethod: "MFA - Authenticator App"
  },
  {
    id: "log-2",
    userName: "Miguel Reyes",
    email: "miguel@internalops.com",
    loginTime: "2026-08-11 11:15:22",
    logoutTime: null,
    ipAddress: "192.168.1.102",
    device: "Dell XPS 15",
    browser: "Chrome",
    operatingSystem: "Windows 11",
    location: "Austin, US",
    authMethod: "MFA - Security Key"
  },
  {
    id: "log-3",
    userName: "Priya Shah",
    email: "priya@internalops.com",
    loginTime: "2026-08-11 10:45:00",
    logoutTime: null,
    ipAddress: "103.45.2.19",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    operatingSystem: "iOS 17",
    location: "Mumbai, IN",
    authMethod: "MFA - Authenticator App"
  },
  {
    id: "log-4",
    userName: "Jonas Krieger",
    email: "jonas@internalops.com",
    loginTime: "2026-08-11 09:20:10",
    logoutTime: "2026-08-11 11:00:00",
    ipAddress: "84.120.45.67",
    device: "Lenovo ThinkPad",
    browser: "Firefox",
    operatingSystem: "Ubuntu 22.04 LTS",
    location: "Berlin, DE",
    authMethod: "Password Only"
  },
  {
    id: "log-5",
    userName: "Noor Haddad",
    email: "noor@internalops.com",
    loginTime: "2026-08-11 08:05:43",
    logoutTime: "2026-08-11 10:30:00",
    ipAddress: "195.22.89.12",
    device: "iPad Pro",
    browser: "Chrome Mobile",
    operatingSystem: "iPadOS 17",
    location: "Dubai, AE",
    authMethod: "MFA - SMS OTP"
  }
];

export const mockFailedLogins: FailedLoginRecord[] = [
  {
    id: "fail-1",
    userName: "John Smith",
    email: "john.smith@external.com",
    ipAddress: "203.0.113.5",
    failureReason: "Invalid Password Credential",
    attemptCount: 3,
    dateTime: "2026-08-11 11:42:01",
    device: "Unknown Device",
    status: "active"
  },
  {
    id: "fail-2",
    userName: "Unknown",
    email: "admin@internalops.com",
    ipAddress: "198.51.100.72",
    failureReason: "Brute Force Suspected (Multiple Accounts)",
    attemptCount: 15,
    dateTime: "2026-08-11 11:28:44",
    device: "Linux / Python requests",
    status: "locked"
  },
  {
    id: "fail-3",
    userName: "Sarah Jenkins",
    email: "sarah@internalops.com",
    ipAddress: "192.168.1.115",
    failureReason: "MFA Verification Failed",
    attemptCount: 2,
    dateTime: "2026-08-11 10:15:30",
    device: "Google Pixel 8",
    status: "investigating"
  }
];

export const mockActiveSessions: ActiveSession[] = [
  {
    id: "sess-1",
    userName: "Ada Turing",
    email: "ada@internalops.com",
    loginTime: "2026-08-11 11:30:15",
    lastActivity: "Just now",
    device: "MacBook Pro 16",
    browser: "Safari",
    ipAddress: "192.168.1.50",
    duration: "19m"
  },
  {
    id: "sess-2",
    userName: "Miguel Reyes",
    email: "miguel@internalops.com",
    loginTime: "2026-08-11 11:15:22",
    lastActivity: "3m ago",
    device: "Dell XPS 15",
    browser: "Chrome",
    ipAddress: "192.168.1.102",
    duration: "34m"
  },
  {
    id: "sess-3",
    userName: "Priya Shah",
    email: "priya@internalops.com",
    loginTime: "2026-08-11 10:45:00",
    lastActivity: "24m ago",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    ipAddress: "103.45.2.19",
    duration: "1h 4m"
  }
];

export const mockBlockedIPs: BlockedIP[] = [
  {
    id: "block-1",
    ipAddress: "198.51.100.72",
    reason: "Suspicious API polling on authentication route",
    blockedBy: "System Guard (Auto-Lock)",
    blockedDate: "2026-08-11 11:29:00",
    expiryDate: "2026-08-12 11:29:00",
    status: "active"
  },
  {
    id: "block-2",
    ipAddress: "45.227.254.10",
    reason: "Known malicious VPN range node",
    blockedBy: "Ada Turing",
    blockedDate: "2026-08-10 14:20:00",
    expiryDate: null,
    status: "active"
  },
  {
    id: "block-3",
    ipAddress: "88.190.12.3",
    reason: "Exceeded login attempt lock threshold",
    blockedBy: "System Guard",
    blockedDate: "2026-08-11 05:00:00",
    expiryDate: "2026-08-11 06:00:00",
    status: "expired"
  }
];

export const mockImpersonations: ImpersonationRecord[] = [
  {
    id: "imp-1",
    adminUser: "Ada Turing",
    targetUser: "Devin Miller",
    tenant: "Acme Corp",
    startTime: "2026-08-11 09:30:00",
    endTime: "2026-08-11 10:15:00",
    reason: "Resolving billing integration subscription sync error"
  },
  {
    id: "imp-2",
    adminUser: "Miguel Reyes",
    targetUser: "Olivia Vance",
    tenant: "Stark Industries",
    startTime: "2026-08-11 11:40:00",
    endTime: null,
    reason: "Investigating data visualization custom dashboard crash"
  }
];

export const mockAuditLogs: AuditLogRecord[] = [
  {
    id: "aud-1",
    user: "Ada Turing",
    action: "Update Security Policy",
    module: "Security Policies",
    ipAddress: "192.168.1.50",
    browser: "Safari",
    timestamp: "2026-08-11 11:45:10",
    previousValue: "failedLoginLimit: 5",
    newValue: "failedLoginLimit: 3",
    severity: "high"
  },
  {
    id: "aud-2",
    user: "Miguel Reyes",
    action: "Terminate Active Session",
    module: "Active Sessions",
    ipAddress: "192.168.1.102",
    browser: "Chrome",
    timestamp: "2026-08-11 11:32:00",
    previousValue: "Session ID: sess-x92",
    newValue: "Status: REVOKED",
    severity: "medium"
  },
  {
    id: "aud-3",
    user: "System Admin",
    action: "Add IP Block",
    module: "Blocked IPs",
    ipAddress: "127.0.0.1",
    browser: "Server System Engine",
    timestamp: "2026-08-11 11:29:00",
    previousValue: null,
    newValue: "IP Address: 198.51.100.72",
    severity: "critical"
  },
  {
    id: "aud-4",
    user: "Ada Turing",
    action: "Enable MFA Mandatory",
    module: "MFA Settings",
    ipAddress: "192.168.1.50",
    browser: "Safari",
    timestamp: "2026-08-11 10:10:00",
    previousValue: "MFA Mandatory: false",
    newValue: "MFA Mandatory for Role: Admin",
    severity: "high"
  }
];

export const defaultSecurityPolicy: SecurityPolicyConfig = {
  passwordPolicy: {
    minimumLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90,
    historyCount: 5
  },
  loginPolicy: {
    failedLoginLimit: 5,
    accountLockDurationMinutes: 15,
    captchaEnabled: true
  },
  sessionPolicy: {
    sessionTimeoutMinutes: 30,
    maxConcurrentSessions: 3,
    autoLogoutEnabled: true
  },
  mfaPolicy: {
    enabled: true,
    mandatoryRoles: ["owner", "admin"],
    recoveryCodesEnabled: true,
    trustedDevicesEnabled: true,
    verificationFrequencyDays: 30
  },
  ipPolicy: {
    allowList: ["192.168.1.0/24", "10.0.0.0/8"],
    blockList: ["198.51.100.72"],
    countryRestrictions: ["KP", "IR", "SY"]
  }
};
