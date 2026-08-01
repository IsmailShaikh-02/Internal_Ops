import type { TenantActivity, TenantAuditLog } from "../types";

export const mockActivities: TenantActivity[] = [
  {
    id: "act-1",
    tenantId: "northwind-labs",
    tenantName: "Northwind Labs",
    actor: {
      name: "Northwind Admin",
      email: "admin@northwindlabs.com"
    },
    action: "User Invited",
    category: "User Management",
    status: "Success",
    timestamp: "2026-08-02T15:30:00Z",
    details: "Invited sarah.connor@northwindlabs.com to organization as Member."
  },
  {
    id: "act-2",
    tenantId: "acme-industrial",
    tenantName: "Acme Industrial",
    actor: {
      name: "Acme Admin",
      email: "admin@acmeindustrial.com"
    },
    action: "Module Enabled",
    category: "Configuration",
    status: "Success",
    timestamp: "2026-08-02T14:45:00Z",
    details: "Enabled CRM module for trial instance."
  },
  {
    id: "act-3",
    tenantId: "stark-industries",
    tenantName: "Stark Industries",
    actor: {
      name: "Tony Stark",
      email: "pepper@stark.com"
    },
    action: "Subscription Payment Failed",
    category: "Billing",
    status: "Failed",
    timestamp: "2026-08-02T13:20:00Z",
    details: "Card ending in 4242 was declined by the gateway."
  },
  {
    id: "act-4",
    tenantId: "contoso-ltd",
    tenantName: "Contoso Ltd",
    actor: {
      name: "Contoso Admin",
      email: "admin@contoso.com"
    },
    action: "Custom Domain Configured",
    category: "Configuration",
    status: "Success",
    timestamp: "2026-08-02T11:10:00Z",
    details: "Successfully mapped portal.contoso.com to contoso.internalops.app."
  },
  {
    id: "act-5",
    tenantId: "vector-freight",
    tenantName: "Vector Freight",
    actor: {
      name: "Vector Admin",
      email: "admin@vectorfreight.com"
    },
    action: "API Key Generated",
    category: "Security",
    status: "Success",
    timestamp: "2026-08-02T10:05:00Z",
    details: "Generated write-access API token for shipping integrations."
  },
  {
    id: "act-6",
    tenantId: "northwind-labs",
    tenantName: "Northwind Labs",
    actor: {
      name: "Sarah Connor",
      email: "sarah.connor@northwindlabs.com"
    },
    action: "User Login",
    category: "Security",
    status: "Success",
    timestamp: "2026-08-02T09:30:00Z",
    details: "Login successful from IP 198.51.100.42 (London, UK)."
  },
  {
    id: "act-7",
    tenantId: "stark-industries",
    tenantName: "Stark Industries",
    actor: {
      name: "Tony Stark",
      email: "pepper@stark.com"
    },
    action: "Resource Allocation Exceeded",
    category: "System",
    status: "Warning",
    timestamp: "2026-08-02T08:15:00Z",
    details: "Storage usage has reached 99.1% of the allocated 200 GB limit."
  },
  {
    id: "act-8",
    tenantId: "contoso-ltd",
    tenantName: "Contoso Ltd",
    actor: {
      name: "Contoso Admin",
      email: "admin@contoso.com"
    },
    action: "Database Backup Created",
    category: "System",
    status: "Success",
    timestamp: "2026-08-02T04:00:00Z",
    details: "Automated daily backup created successfully: backup_20260802_contoso.sql.gz."
  },
  {
    id: "act-9",
    tenantId: "acme-industrial",
    tenantName: "Acme Industrial",
    actor: {
      name: "Acme Admin",
      email: "admin@acmeindustrial.com"
    },
    action: "SSO Config Update",
    category: "Security",
    status: "Pending",
    timestamp: "2026-08-02T03:10:00Z",
    details: "SAML certificate update initiated, awaiting metadata validation."
  },
  {
    id: "act-10",
    tenantId: "vector-freight",
    tenantName: "Vector Freight",
    actor: {
      name: "Vector Admin",
      email: "admin@vectorfreight.com"
    },
    action: "Billing Plan Upgraded",
    category: "Billing",
    status: "Success",
    timestamp: "2026-08-01T18:00:00Z",
    details: "Upgraded subscription from Growth to Growth (Plus) with additional seats."
  }
];

export const mockAuditLogs: TenantAuditLog[] = [
  {
    id: "aud-1",
    tenantId: "contoso-ltd",
    tenantName: "Contoso Ltd",
    event: "SAML SSO Disabled",
    category: "Access Control",
    severity: "Critical",
    actorEmail: "admin@contoso.com",
    ipAddress: "203.0.113.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0",
    timestamp: "2026-08-02T15:42:00Z",
    resourceId: "sso-cfg-contoso"
  },
  {
    id: "aud-2",
    tenantId: "northwind-labs",
    tenantName: "Northwind Labs",
    event: "Billing Address Updated",
    category: "Subscription",
    severity: "Low",
    actorEmail: "billing@northwindlabs.com",
    ipAddress: "198.51.100.5",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/16.5",
    timestamp: "2026-08-02T14:15:00Z",
    resourceId: "bill-addr-northwind"
  },
  {
    id: "aud-3",
    tenantId: "stark-industries",
    tenantName: "Stark Industries",
    event: "All Tenant Features Suspended",
    category: "Subscription",
    severity: "High",
    actorEmail: "billing-daemon@internalops.app",
    ipAddress: "127.0.0.1",
    userAgent: "InternalOps System Cron",
    timestamp: "2026-08-02T13:25:00Z",
    resourceId: "stark-industries"
  },
  {
    id: "aud-4",
    tenantId: "acme-industrial",
    tenantName: "Acme Industrial",
    event: "API Key Revoked",
    category: "Security",
    severity: "Medium",
    actorEmail: "admin@acmeindustrial.com",
    ipAddress: "192.0.2.14",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/114.0.0.0",
    timestamp: "2026-08-02T12:05:00Z",
    resourceId: "api-key-acme-prod"
  },
  {
    id: "aud-5",
    tenantId: "vector-freight",
    tenantName: "Vector Freight",
    event: "Bulk Export of Users",
    category: "Data Export",
    severity: "High",
    actorEmail: "admin@vectorfreight.com",
    ipAddress: "203.0.113.5",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/114.0",
    timestamp: "2026-08-02T10:50:00Z",
    resourceId: "users-csv-export"
  },
  {
    id: "aud-6",
    tenantId: "northwind-labs",
    tenantName: "Northwind Labs",
    event: "Password Policy Changed",
    category: "Settings Change",
    severity: "Medium",
    actorEmail: "admin@northwindlabs.com",
    ipAddress: "198.51.100.4",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0",
    timestamp: "2026-08-02T08:20:00Z",
    resourceId: "pwd-policy-northwind"
  },
  {
    id: "aud-7",
    tenantId: "contoso-ltd",
    tenantName: "Contoso Ltd",
    event: "IP Whitelist Configured",
    category: "Security",
    severity: "Medium",
    actorEmail: "admin@contoso.com",
    ipAddress: "203.0.113.88",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0",
    timestamp: "2026-08-01T22:15:00Z",
    resourceId: "ip-whitelist-contoso"
  },
  {
    id: "aud-8",
    tenantId: "acme-industrial",
    tenantName: "Acme Industrial",
    event: "User Role Updated",
    category: "Access Control",
    severity: "Info",
    actorEmail: "admin@acmeindustrial.com",
    ipAddress: "192.0.2.14",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/114.0.0.0",
    timestamp: "2026-08-01T17:40:00Z",
    resourceId: "user-role-bob"
  }
];
