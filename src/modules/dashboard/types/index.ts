export interface MetricDetail {
  value: number | string;
  trend: string;
  subtitle: string;
}

export interface OverviewMetrics {
  mrr: MetricDetail;
  arr: MetricDetail;
  activeTenants: MetricDetail;
  activeUsers: MetricDetail;
  storageUsage: MetricDetail;
  aiSpend: MetricDetail;
  serverHealth: MetricDetail;
  openTickets: MetricDetail;
}

export interface RevenueTrendPoint {
  month?: string;
  day?: string;
  mrr: number;
}

export interface RevenueTrend {
  "12M": RevenueTrendPoint[];
  "6M": RevenueTrendPoint[];
  "30D": RevenueTrendPoint[];
}

export interface SystemStatusItem {
  region: string;
  latency: string;
  status: "healthy" | "warning" | "critical";
}

export interface AlertItem {
  type: "critical" | "warning" | "info" | "success";
  message: string;
  time: string;
}

export interface TenantGrowthItem {
  month: string;
  tenants: number;
}

export interface ModuleUsageItem {
  module: string;
  tenants: number;
}

export interface AiTokenUsageItem {
  day: string;
  tokens: number;
}

export interface RecentTenantItem {
  id: number;
  tenant: string;
  plan: string;
  status: string;
  mrr: number;
  users: number;
}

export interface RecentPaymentItem {
  id: number;
  tenant: string;
  amount: number;
  method: string;
  status: string;
  date: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
}

export interface DashboardData {
  overview: OverviewMetrics;
  revenueTrend: RevenueTrend;
  systemStatus: SystemStatusItem[];
  alerts: AlertItem[];
  tenantGrowth: TenantGrowthItem[];
  moduleUsage: ModuleUsageItem[];
  aiTokenUsage: AiTokenUsageItem[];
  recentTenants: RecentTenantItem[];
  recentPayments: RecentPaymentItem[];
  quickActions: QuickActionItem[];
}
