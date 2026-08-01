export interface TenantActivity {
  id: string;
  tenantId: string;
  tenantName: string;
  actor: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  action: string;
  category: "User Management" | "Billing" | "Configuration" | "Security" | "System";
  status: "Success" | "Failed" | "Warning" | "Pending";
  timestamp: string;
  details: string;
}

export interface TenantAuditLog {
  id: string;
  tenantId: string;
  tenantName: string;
  event: string;
  category: "Access Control" | "Data Export" | "Settings Change" | "Subscription" | "Security";
  severity: "Info" | "Low" | "Medium" | "High" | "Critical";
  actorEmail: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  resourceId: string;
}
