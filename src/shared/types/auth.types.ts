export type PlatformRole = 'Platform Owner' | 'Super Admin' | 'Finance Admin' | 'Support Admin' | 'Auditor';

export type PlatformPermission =
  | '*'
  // Dashboard
  | 'Dashboard.View'
  // Tenants
  | 'Tenant.View'
  | 'Tenant.Create'
  | 'Tenant.Edit'
  | 'Tenant.Delete'
  // Billing
  | 'Billing.View'
  | 'Billing.Manage'
  // Support
  | 'Support.View'
  | 'Support.Manage'
  // Security
  | 'Security.View'
  | 'Security.Manage'
  // Audit Logs
  | 'AuditLog.View';

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: PlatformRole;
  permissions: PlatformPermission[];
  status: 'Active' | 'Suspended' | 'Pending';
  department: string;
  mfaEnabled: boolean;
  lastLoginAt?: string;
}
