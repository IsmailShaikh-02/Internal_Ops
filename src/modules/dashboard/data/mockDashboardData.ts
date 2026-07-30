import type { AlertItem, SystemStatusItem } from "../types";

export const mockDashboardData = {
  overview: {
     mrr: {
    value: 284500,
    trend: "+4.2%",
    subtitle: "vs previous 30 days",
  },

  arr: {
    value: 3414000,
    trend: "+11.6%",
    subtitle: "Trailing twelve months",
  },

  activeTenants: {
    value: 14,
    trend: "+6",
    subtitle: "8 on trial",
  },

  activeUsers: {
    value: 12487,
    trend: "+3.1%",
    subtitle: "Daily active, last 24h",
  },

  storageUsage: {
    value: "4.7 TB",
    trend: "+0.4 TB",
    subtitle: "R2 buckets",
  },

  aiSpend: {
    value: "$8,640",
    trend: "-2.4%",
    subtitle: "OpenAI + fallbacks",
  },

  serverHealth: {
    value: "99.982%",
    trend: "SLO OK",
    subtitle: "30-day uptime",
  },

  openTickets: {
    value: 34,
    trend: "-4",
    subtitle: "8 urgent",
  },
},

  revenueTrend: {
    "12M": [
  { month: "Jan", mrr: 180000 },
  { month: "Feb", mrr: 192500 },
  { month: "Mar", mrr: 187800 }, // churn
  { month: "Apr", mrr: 205400 },
  { month: "May", mrr: 221900 },
  { month: "Jun", mrr: 214600 }, // slight dip
  { month: "Jul", mrr: 236800 },
  { month: "Aug", mrr: 249300 },
  { month: "Sep", mrr: 244700 }, // plateau
  { month: "Oct", mrr: 267500 },
  { month: "Nov", mrr: 289400 },
  { month: "Dec", mrr: 317000 }, // year-end growth
],

"6M": [
  { month: "Jul", mrr: 236800 },
  { month: "Aug", mrr: 249300 },
  { month: "Sep", mrr: 244700 },
  { month: "Oct", mrr: 267500 },
  { month: "Nov", mrr: 289400 },
  { month: "Dec", mrr: 317000 },
],

"30D": [
  { day: "W1", mrr: 289400 },
  { day: "W2", mrr: 293100 },
  { day: "W3", mrr: 290800 }, // weekly churn
  { day: "W4", mrr: 317000 }, // strong finish
],
  },

  systemStatus: [
    {
    region: "us-east",
    latency: "84 ms",
    status: "healthy",
  },
  {
    region: "us-west",
    latency: "92 ms",
    status: "healthy",
  },
  {
    region: "eu-west",
    latency: "812 ms",
    status: "warning",
  },
  {
    region: "ap-south",
    latency: "141 ms",
    status: "healthy",
  },]satisfies SystemStatusItem[],
  alerts: [
  {
    type: "critical",
    message: "API latency P99 above 800ms in eu-west",
    time: "2m ago",
  },

  {
    type: "warning",
    message: "Redis memory 82% on cluster ops-2",
    time: "14m ago",
  },

  {
    type: "info",
    message: "Nightly backup completed (4.2TB)",
    time: "1h ago",
  },

  {
    type: "warning",
    message: "Failed logins spike from AS15169",
    time: "3h ago",
  },
]satisfies AlertItem[],

  tenantGrowth: [
    { month: "Jan", tenants: 18 },
  { month: "Feb", tenants: 22 },
  { month: "Mar", tenants: 30 },
  { month: "Apr", tenants: 37 },
  { month: "May", tenants: 49 },
  { month: "Jun", tenants: 58 },
  { month: "Jul", tenants: 69 },
  { month: "Aug", tenants: 81 },
  { month: "Sep", tenants: 92 },
  { month: "Oct", tenants: 101 },
  { month: "Nov", tenants: 111 },
  { month: "Dec", tenants: 120 },
  ],

  moduleUsage: [
     { module: "HR", tenants: 65 },
  { module: "Finance", tenants: 69 },
  { module: "CRM", tenants: 73 },
  { module: "Inventory", tenants: 77 },
  { module: "Projects", tenants: 81 },
  { module: "Docs", tenants: 85 },
  { module: "Analytics", tenants: 89 },
  ],

  aiTokenUsage: [
     { day: "D1", tokens: 5000 },
  { day: "D2", tokens: 8200 },
  { day: "D3", tokens: 11000 },
  { day: "D4", tokens: 14500 },
  { day: "D5", tokens: 19000 },
  { day: "D6", tokens: 24000 },
  { day: "D7", tokens: 30000 },
  { day: "D8", tokens: 36000 },
  { day: "D9", tokens: 42000 },
  { day: "D10", tokens: 47000 },
  { day: "D11", tokens: 53000 },
  { day: "D12", tokens: 60000 },
  { day: "D13", tokens: 66000 },
  { day: "D14", tokens: 72000 },
  ],

  recentTenants: [
     {
    id: 1,
    tenant: "Northwind Labs",
    plan: "Growth",
    status: "Active",
    mrr: 695,
    users: 163,
  },
  {
    id: 2,
    tenant: "Acme Industrial",
    plan: "Growth",
    status: "Trial",
    mrr: 704,
    users: 182,
  },
  {
    id: 3,
    tenant: "Vector Freight",
    plan: "Growth",
    status: "Trial",
    mrr: 714,
    users: 202,
  },
  {
    id: 4,
    tenant: "Halcyon Health",
    plan: "Growth",
    status: "Trial",
    mrr: 723,
    users: 221,
  },
  {
    id: 5,
    tenant: "Meridian Bank",
    plan: "Growth",
    status: "Trial",
    mrr: 733,
    users: 240,
  },
  {
    id: 6,
    tenant: "Aster Retail",
    plan: "Growth",
    status: "Suspended",
    mrr: 743,
    users: 259,
  },
  {
    id: 4,
    tenant: "Halcyon Health",
    plan: "Growth",
    status: "Trial",
    mrr: 723,
    users: 221,
  },
  {
    id: 5,
    tenant: "Meridian Bank",
    plan: "Growth",
    status: "Trial",
    mrr: 733,
    users: 240,
  },
  {
    id: 6,
    tenant: "Aster Retail",
    plan: "Growth",
    status: "Suspended",
    mrr: 743,
    users: 259,
  },
  ],

  recentPayments: [
     {
    id: 1,
    tenant: "Northwind Labs",
    amount: 695,
    method: "Visa ••4242",
    status: "Succeeded",
    date: "2026-07-28",
  },
  {
    id: 2,
    tenant: "Acme Industrial",
    amount: 704,
    method: "Amex ••1005",
    status: "Succeeded",
    date: "2026-07-28",
  },
  {
    id: 3,
    tenant: "Vector Freight",
    amount: 714,
    method: "SEPA",
    status: "Succeeded",
    date: "2026-07-27",
  },
  {
    id: 4,
    tenant: "Halcyon Health",
    amount: 723,
    method: "ACH",
    status: "Refunded",
    date: "2026-07-27",
  },
  {
    id: 5,
    tenant: "Meridian Bank",
    amount: 733,
    method: "Visa ••4242",
    status: "Failed",
    date: "2026-07-27",
  },
  {
    id: 6,
    tenant: "Aster Retail",
    amount: 743,
    method: "Amex ••1005",
    status: "Succeeded",
    date: "2026-07-27",
  },
  {
    id: 5,
    tenant: "Meridian Bank",
    amount: 733,
    method: "Visa ••4242",
    status: "Failed",
    date: "2026-07-27",
  },
  {
    id: 6,
    tenant: "Aster Retail",
    amount: 743,
    method: "Amex ••1005",
    status: "Succeeded",
    date: "2026-07-27",
  },
  ],

  quickActions: [
     {
    id: "create-tenant",
    label: "Create tenant",
    icon: "plus",
  },
  {
    id: "impersonate",
    label: "Impersonate",
    icon: "user",
  },
  {
    id: "announcement",
    label: "New announcement",
    icon: "megaphone",
  },
  {
    id: "maintenance",
    label: "Trigger maintenance",
    icon: "wrench",
  },
  ],
};