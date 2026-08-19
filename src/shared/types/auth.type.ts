// File: src/shared/types/auth.types.ts

/**
 * All 12 Functional Platform Scopes matching InternalOps FRDs
 */
export type PlatformPermission =
  // Wildcard (Full superuser access)
  | "*"

  // Module 1: Dashboard & Analytics
  | "Dashboard.View"
  | "Dashboard.Export"

  // Module 2: Tenant Lifecycle Management (FRD-001)
  | "Tenant.View"
  | "Tenant.Create"
  | "Tenant.Edit"
  | "Tenant.Suspend"
  | "Tenant.Delete"
  | "Tenant.Impersonate"

  // Module 3: Subscriptions & Billing (FRD-002)
  | "Billing.View"
  | "Billing.ManagePlans"
  | "Billing.ApplyCoupons"
  | "Billing.Invoices"
  | "Billing.Refund"

  // Module 4: Feature Flags & Overrides (FRD-003)
  | "FeatureFlag.View"
  | "FeatureFlag.Toggle"
  | "FeatureFlag.Create"
  | "FeatureFlag.Delete"

  // Module 5: Platform Console Users & IAM (FRD-005)
  | "PlatformUser.View"
  | "PlatformUser.Invite"
  | "PlatformUser.EditRoles"
  | "PlatformUser.Revoke"

  // Module 6: System Health & Infrastructure (FRD-004)
  | "Infrastructure.View"
  | "Infrastructure.RestartService"
  | "Infrastructure.Scaling"

  // Module 7: Security & Audit Logs (FRD-006)
  | "AuditLog.View"
  | "AuditLog.Export"
  | "Security.ViewPolicies"
  | "Security.ManageIPWhitelist"

  // Module 8: Support & Impersonation (FRD-007)
  | "Support.ViewTickets"
  | "Support.Reply"
  | "Support.CreateTicket"

  // Module 9: Notifications & Webhooks (FRD-008)
  | "Notification.View"
  | "Notification.Broadcast"
  | "Notification.ManageWebhooks"

  // Module 10: Platform Configuration & Settings
  | "Settings.View"
  | "Settings.Edit"

  // Module 11: Compliance & Data Privacy (FRD-009)
  | "Compliance.View"
  | "Compliance.ExportData"
  | "Compliance.PurgeTenant"

  // Module 12: API Keys & External Integrations (FRD-010)
  | "Integration.View"
  | "Integration.GenerateKey"
  | "Integration.RevokeKey";