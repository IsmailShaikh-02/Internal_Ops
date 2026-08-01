export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member";
  status: "Active" | "Invited" | "Suspended";
  joinedDate: string;
}

export interface TenantInvoice {
  id: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  issued: string;
  due: string;
}

export interface TenantActivity {
  id: string;
  event: string;
  user: string;
  ipAddress: string;
  timestamp: string;
}

export interface TenantAuditLog {
  id: string;
  action: string;
  user: string;
  category: "Security" | "Configuration" | "Access";
  timestamp: string;
}

export interface TenantTimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "info" | "success" | "warning" | "danger";
}

export const mockInvoices: Record<string, TenantInvoice[]> = {
  "northwind-labs": [
    { id: "INV-2026-4820", amount: "$695", status: "Paid", issued: "8/1/2026", due: "8/16/2026" },
    { id: "INV-2026-4112", amount: "$695", status: "Paid", issued: "7/1/2026", due: "7/16/2026" },
    { id: "INV-2026-3401", amount: "$695", status: "Paid", issued: "6/1/2026", due: "6/16/2026" },
  ],
  "acme-industrial": [
    { id: "INV-2026-4900", amount: "$704", status: "Paid", issued: "8/1/2026", due: "8/16/2026" },
  ],
  "vector-freight": [
    { id: "INV-2026-5000", amount: "$714", status: "Pending", issued: "8/1/2026", due: "8/16/2026" },
  ],
};

export const mockUsers: Record<string, TenantUser[]> = {
  "northwind-labs": [
    { id: "u1", name: "Northwind Admin", email: "admin@northwindlabs.com", role: "Owner", status: "Active", joinedDate: "8/11/2025" },
    { id: "u2", name: "Sarah Connor", email: "sarah@northwindlabs.com", role: "Admin", status: "Active", joinedDate: "8/12/2025" },
    { id: "u3", name: "John Doe", email: "john@northwindlabs.com", role: "Member", status: "Active", joinedDate: "9/01/2025" },
    { id: "u4", name: "Alice Smith", email: "alice@northwindlabs.com", role: "Member", status: "Invited", joinedDate: "10/05/2025" },
  ],
  "acme-industrial": [
    { id: "u5", name: "Acme Admin", email: "admin@acmeindustrial.com", role: "Owner", status: "Active", joinedDate: "9/15/2025" },
    { id: "u6", name: "Robert Patrick", email: "robert@acmeindustrial.com", role: "Admin", status: "Active", joinedDate: "9/16/2025" },
  ],
};

export const mockActivities: Record<string, TenantActivity[]> = {
  "northwind-labs": [
    { id: "a1", event: "User login successful", user: "sarah@northwindlabs.com", ipAddress: "192.168.1.45", timestamp: "2026-08-01 16:32:11" },
    { id: "a2", event: "Projects module enabled", user: "admin@northwindlabs.com", ipAddress: "192.168.1.1", timestamp: "2026-08-01 15:10:45" },
    { id: "a3", event: "Billing invoice INV-2026-4820 paid", user: "System", ipAddress: "N/A", timestamp: "2026-08-01 00:05:00" },
    { id: "a4", event: "API key updated", user: "admin@northwindlabs.com", ipAddress: "192.168.1.1", timestamp: "2026-07-28 11:22:00" },
  ],
};

export const mockAuditLogs: Record<string, TenantAuditLog[]> = {
  "northwind-labs": [
    { id: "au1", action: "Tenant settings updated (Domain alias)", user: "admin@northwindlabs.com", category: "Configuration", timestamp: "2026-08-01 14:02:15" },
    { id: "au2", action: "Impersonation session started by Platform Owner", user: "Ada Turing (Platform)", category: "Access", timestamp: "2026-07-30 09:15:33" },
    { id: "au3", action: "MFA required enforcement enabled", user: "admin@northwindlabs.com", category: "Security", timestamp: "2026-07-15 10:00:00" },
  ],
};

export const mockTimelineEvents: Record<string, TenantTimelineEvent[]> = {
  "northwind-labs": [
    { id: "t1", title: "Tenant Registered", description: "Northwind Labs registered on the InternalOps Platform.", date: "8/11/2025", type: "success" },
    { id: "t2", title: "Plan Upgraded to Growth", description: "Upgraded from Free Trial to Growth plan subscription.", date: "9/01/2025", type: "info" },
    { id: "t3", title: "Storage Warning", description: "Storage space reached 85% capacity.", date: "12/10/2025", type: "warning" },
    { id: "t4", title: "Impersonation Logged", description: "Support team impersonated owner for debugging session.", date: "7/30/2026", type: "danger" },
  ],
};
