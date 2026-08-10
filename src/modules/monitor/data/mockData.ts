// src/modules/monitor/data/mockData.ts

import {
  type SystemHealthKPIs,
  type MonitoredComponent,
  type ServerInfo,
  type ApiEndpointMetrics,
  type ApiOverallMetrics,
  type QueueInfo,
  type RedisMetrics,
  type StorageMetrics,
  type DatabaseMetrics,
  type BackgroundJob,
  type ScheduledJob,
  type LogEntry
} from "../types";

export const systemHealthKPIs: SystemHealthKPIs = {
  overallHealth: "healthy",
  uptime: 99.982,
  activeServices: 8,
  failedServices: 0,
  cpuUsage: 42,
  memoryUsage: 68,
  diskUsage: 54,
  activeAlerts: 1,
};

export const monitoredComponents: MonitoredComponent[] = [
  { name: "Web Server (Nginx)", status: "up", latency: 12, message: "Operational" },
  { name: "Application Server (Node/Express)", status: "up", latency: 24, message: "Operational" },
  { name: "Database (PostgreSQL)", status: "up", latency: 4, message: "Active - 84 connections" },
  { name: "Redis Cache", status: "up", latency: 1, message: "Active - 12.4K keys" },
  { name: "Queue Workers (BullMQ)", status: "up", latency: 15, message: "184 active workers" },
  { name: "File Storage (S3-Compatible)", status: "up", latency: 45, message: "Operational" },
  { name: "SMTP Service (SendGrid)", status: "up", latency: 110, message: "Operational" },
  { name: "AI Services (Google Vertex/OpenAI)", status: "up", latency: 320, message: "Operational" },
];

export const uptimeTrend = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: 99.9 + Math.random() * 0.1,
}));

export const requestsTrend = [
  { time: "10:00", value: 1200 },
  { time: "10:05", value: 1450 },
  { time: "10:10", value: 1100 },
  { time: "10:15", value: 1600 },
  { time: "10:20", value: 1800 },
  { time: "10:25", value: 1950 },
  { time: "10:30", value: 1700 },
];

export const latencyTrend = [
  { time: "10:00", value: 240 },
  { time: "10:05", value: 250 },
  { time: "10:10", value: 284 },
  { time: "10:15", value: 260 },
  { time: "10:20", value: 290 },
  { time: "10:25", value: 275 },
  { time: "10:30", value: 284 },
];

export const errorsTrend = [
  { time: "10:00", value: 2 },
  { time: "10:05", value: 4 },
  { time: "10:10", value: 1 },
  { time: "10:15", value: 5 },
  { time: "10:20", value: 3 },
  { time: "10:25", value: 2 },
  { time: "10:30", value: 1 },
];

export const queueTrend = [
  { time: "10:00", value: 80 },
  { time: "10:05", value: 120 },
  { time: "10:10", value: 150 },
  { time: "10:15", value: 110 },
  { time: "10:20", value: 90 },
  { time: "10:25", value: 140 },
  { time: "10:30", value: 184 },
];

export const serversMock: ServerInfo[] = [
  {
    id: "srv-01",
    name: "us-east-app-01",
    status: "online",
    cpuUsage: 34,
    memoryUsage: 64,
    diskUsage: 48,
    networkUsage: { rx: "1.2 MB/s", tx: "3.4 MB/s" },
    lastRestart: "2026-08-01 04:30",
    processes: [
      { pid: 3012, name: "node /app/server.js", cpu: 12.4, memory: 412, status: "running" },
      { pid: 1409, name: "nginx -g daemon off;", cpu: 1.2, memory: 45, status: "running" },
      { pid: 994, name: "pm2 Daemon", cpu: 0.2, memory: 85, status: "sleeping" },
    ],
  },
  {
    id: "srv-02",
    name: "us-east-app-02",
    status: "online",
    cpuUsage: 48,
    memoryUsage: 72,
    diskUsage: 51,
    networkUsage: { rx: "2.1 MB/s", tx: "5.1 MB/s" },
    lastRestart: "2026-08-01 04:35",
    processes: [
      { pid: 3105, name: "node /app/server.js", cpu: 20.8, memory: 480, status: "running" },
      { pid: 1450, name: "nginx -g daemon off;", cpu: 1.8, memory: 48, status: "running" },
      { pid: 1012, name: "pm2 Daemon", cpu: 0.2, memory: 85, status: "sleeping" },
    ],
  },
  {
    id: "srv-03",
    name: "eu-west-app-01",
    status: "online",
    cpuUsage: 22,
    memoryUsage: 50,
    diskUsage: 39,
    networkUsage: { rx: "0.8 MB/s", tx: "1.9 MB/s" },
    lastRestart: "2026-08-03 12:00",
    processes: [
      { pid: 2841, name: "node /app/server.js", cpu: 8.5, memory: 390, status: "running" },
      { pid: 1102, name: "nginx -g daemon off;", cpu: 0.5, memory: 35, status: "running" },
    ],
  },
  {
    id: "srv-04",
    name: "ap-south-app-01",
    status: "maintenance",
    cpuUsage: 0,
    memoryUsage: 12,
    diskUsage: 45,
    networkUsage: { rx: "0 KB/s", tx: "0 KB/s" },
    lastRestart: "2026-08-10 10:15",
    processes: [
      { pid: 880, name: "systemd-networkd", cpu: 0.0, memory: 8, status: "sleeping" },
    ],
  },
];

export const apiOverallMetrics: ApiOverallMetrics = {
  availability: 99.95,
  responseTime: 284,
  requestCount: 845209,
  successRate: 99.86,
  errorRate: 0.14,
  timeoutRate: 0.02,
};

export const apiEndpointsMock: ApiEndpointMetrics[] = [
  { endpoint: "/api/v1/auth/login", method: "POST", requests: 124500, responseTime: 180, successRate: 99.2, errorRate: 0.8 },
  { endpoint: "/api/v1/tenants/create", method: "POST", requests: 3450, responseTime: 840, successRate: 98.4, errorRate: 1.6 },
  { endpoint: "/api/v1/tenants/list", method: "GET", requests: 412900, responseTime: 145, successRate: 99.9, errorRate: 0.1 },
  { endpoint: "/api/v1/billing/invoices", method: "GET", requests: 89000, responseTime: 320, successRate: 99.7, errorRate: 0.3 },
  { endpoint: "/api/v1/features/flags", method: "GET", requests: 154000, responseTime: 45, successRate: 100.0, errorRate: 0.0 },
  { endpoint: "/api/v1/support/tickets", method: "POST", requests: 12300, responseTime: 410, successRate: 97.8, errorRate: 2.2 },
  { endpoint: "/api/v1/ai/generate", method: "POST", requests: 48950, responseTime: 1850, successRate: 96.5, errorRate: 3.5 },
];

export const queueInfoMock: QueueInfo[] = [
  { name: "default-job-queue", pendingJobs: 12, processingJobs: 4, failedJobs: 145, retryCount: 290, avgProcessingTime: 180, status: "active" },
  { name: "high-priority-billing", pendingJobs: 0, processingJobs: 0, failedJobs: 12, retryCount: 24, avgProcessingTime: 340, status: "active" },
  { name: "email-notification-queue", pendingJobs: 84, processingJobs: 8, failedJobs: 512, retryCount: 1024, avgProcessingTime: 95, status: "active" },
  { name: "ai-processing-heavy", pendingJobs: 42, processingJobs: 2, failedJobs: 88, retryCount: 176, avgProcessingTime: 4800, status: "paused" },
  { name: "tenant-cleanup-logs", pendingJobs: 0, processingJobs: 0, failedJobs: 0, retryCount: 0, avgProcessingTime: 0, status: "draining" },
];

export const redisMetricsMock: RedisMetrics = {
  connectionStatus: "connected",
  memoryUsage: 256.4,
  maxMemory: 1024,
  cacheHitRatio: 88.4,
  activeKeys: 12450,
  expiredKeys: 1845,
  evictedKeys: 42,
};

export const redisTrendData = Array.from({ length: 12 }, (_, i) => ({
  time: `${10 + Math.floor(i / 12)}:${(i * 5) % 60 === 0 ? "00" : (i * 5) % 60}`,
  memory: 240 + Math.random() * 20,
  hitRatio: 85 + Math.random() * 5,
}));

export const storageMetricsMock: StorageMetrics = {
  totalStorage: 2048,
  usedStorage: 1105.4,
  freeStorage: 942.6,
  backupStorage: 450.2,
  fileCount: 452900,
  breakdown: {
    documents: 245.5,
    images: 412.3,
    videos: 310.2,
    attachments: 85.4,
    logs: 32.0,
    backups: 20.0,
  },
};

export const databaseMetricsMock: DatabaseMetrics[] = [
  {
    name: "postgresql-primary",
    status: "online",
    activeConnections: 84,
    slowQueriesCount: 3,
    replicationStatus: "healthy",
    storageUsage: 345.8,
    queryPerformance: 850,
    slowQueries: [
      { id: "q-01", query: "SELECT * FROM tenants t LEFT JOIN billing_subscriptions s ON t.id = s.tenant_id WHERE t.status = 'active' AND s.expires_at < NOW() ORDER BY t.created_at DESC;", duration: 850, timestamp: "2026-08-10 11:02:14", database: "postgresql-primary" },
      { id: "q-02", query: "SELECT COUNT(*), status FROM support_tickets GROUP BY status ORDER BY count DESC;", duration: 420, timestamp: "2026-08-10 11:05:40", database: "postgresql-primary" },
      { id: "q-03", query: "UPDATE tenant_feature_overrides SET config = config || '{\"max_users\": 100}' WHERE tenant_id IN (SELECT id FROM tenants WHERE tier = 'enterprise');", duration: 610, timestamp: "2026-08-10 11:08:11", database: "postgresql-primary" },
    ],
  },
  {
    name: "postgresql-replica-01",
    status: "replicating",
    activeConnections: 42,
    slowQueriesCount: 0,
    replicationStatus: "healthy",
    storageUsage: 345.8,
    queryPerformance: 620,
    slowQueries: [],
  },
];

export const backgroundJobsMock: BackgroundJob[] = [
  { id: "bj-01", name: "Monthly Tenant Invoice Generation", queue: "high-priority-billing", status: "completed", executionTime: 12450, retryCount: 0, lastRun: "2026-08-10 00:05" },
  { id: "bj-02", name: "AI Content Summarization", queue: "ai-processing-heavy", status: "failed", executionTime: 8400, retryCount: 2, lastRun: "2026-08-10 11:10", error: "API Timeout: Vertex AI returned status code 504 Gateway Timeout" },
  { id: "bj-03", name: "Send Notification Digest Emails", queue: "email-notification-queue", status: "processing", executionTime: 4200, retryCount: 1, lastRun: "2026-08-10 11:12" },
  { id: "bj-04", name: "Clean Up Expired Session Tokens", queue: "default-job-queue", status: "queued", executionTime: 0, retryCount: 0, lastRun: "2026-08-10 11:00" },
  { id: "bj-05", name: "S3 Sync Database Backups", queue: "tenant-cleanup-logs", status: "completed", executionTime: 45900, retryCount: 0, lastRun: "2026-08-09 23:00" },
];

export const scheduledJobsMock: ScheduledJob[] = [
  { id: "sch-01", name: "Daily Database Maintenance", schedule: "0 2 * * *", lastExecution: "2026-08-10 02:00", nextExecution: "2026-08-11 02:00", status: "active" },
  { id: "sch-02", name: "Hourly Billing Sync", schedule: "0 * * * *", lastExecution: "2026-08-10 11:00", nextExecution: "2026-08-10 12:00", status: "active" },
  { id: "sch-03", name: "Weekly Audit Trail Archive", schedule: "0 0 * * 0", lastExecution: "2026-08-09 00:00", nextExecution: "2026-08-16 00:00", status: "active" },
  { id: "sch-04", name: "Feature Flag Cache Invalidation", schedule: "*/15 * * * *", lastExecution: "2026-08-10 11:00", nextExecution: "2026-08-10 11:15", status: "paused" },
];

export const errorLogsMock: LogEntry[] = [
  {
    id: "err-01",
    timestamp: "2026-08-10 11:12:15",
    severity: "error",
    module: "Billing",
    message: "Stripe webhook signature validation failed. Header: t=175482910,v1=abcde...",
    stackTrace: `Error: Stripe webhook signature validation failed
    at verifyHeader (/app/node_modules/stripe/lib/Webhooks.js:63:15)
    at verifySignature (/app/node_modules/stripe/lib/Webhooks.js:42:12)
    at parseWebhook (/app/src/modules/billing/handlers/stripe.js:14:24)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`,
    status: "unresolved"
  },
  {
    id: "err-02",
    timestamp: "2026-08-10 11:10:42",
    severity: "error",
    module: "AI Services",
    message: "Vertex AI quota exceeded for model: gemini-pro-1.5",
    stackTrace: `GoogleApiError: Quota exceeded for project 'internalops-prod'
    at VertexAIClient.generateContent (/app/src/shared/services/vertex.js:84:18)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`,
    status: "unresolved"
  },
  {
    id: "err-03",
    timestamp: "2026-08-10 11:05:01",
    severity: "warning",
    module: "Database",
    message: "Slow query detected: SELECT * FROM audit_logs WHERE tenant_id = 'ten-412' ORDER BY timestamp DESC LIMIT 50; [Duration: 4.8s]",
    stackTrace: `QueryWarning: Execution took 4820ms
    at DBClient.query (/app/src/shared/db/client.js:104:32)
    at AuditService.getLogs (/app/src/modules/tenants/services/audit.js:12:22)`,
    status: "resolved"
  },
  {
    id: "err-04",
    timestamp: "2026-08-10 10:55:00",
    severity: "error",
    module: "SMTP",
    message: "SMTP handshake failed: Connection timeout to smtp.sendgrid.net:587",
    stackTrace: `Error: Connection timeout
    at SMTPClient._connect (/app/node_modules/nodemailer/lib/smtp-connection/index.js:284:24)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)`,
    status: "unresolved"
  }
];

export const applicationLogsMock: LogEntry[] = [
  { id: "log-01", timestamp: "2026-08-10 11:12:45", severity: "info", module: "Authentication", message: "User 'Ada Turing' (Platform Owner) logged in from IP 192.168.1.45" },
  { id: "log-02", timestamp: "2026-08-10 11:11:30", severity: "info", module: "Billing", message: "Successfully charged Invoice #INV-8841 ($299.00) for tenant 'Acme Corp'" },
  { id: "log-03", timestamp: "2026-08-10 11:10:05", severity: "info", module: "Tenant Activity", message: "Tenant 'Globex Inc' provisioned a new custom domain: portal.globex.com" },
  { id: "log-04", timestamp: "2026-08-10 11:08:12", severity: "debug", module: "API", message: "GET /api/v1/tenants/list returned status 200 OK in 142ms" },
  { id: "log-05", timestamp: "2026-08-10 11:05:00", severity: "info", module: "Scheduler", message: "Cron Job 'Hourly Billing Sync' executed successfully. Processed 14 invoices." },
  { id: "log-06", timestamp: "2026-08-10 11:02:14", severity: "info", module: "Database", message: "Database replication check completed. Replication lag: 14ms" },
  { id: "log-07", timestamp: "2026-08-10 11:00:00", severity: "info", module: "Email", message: "Welcome email sent successfully to user 'john.doe@acme.com'" },
  { id: "log-08", timestamp: "2026-08-10 10:58:30", severity: "info", module: "Notifications", message: "Slack notification sent to channel #ops: Tenant 'Stark Industries' upgraded to Enterprise tier" },
];

export const liveLogsInitial: LogEntry[] = [
  { id: "live-1", timestamp: "11:13:00", severity: "info", module: "API", message: "GET /api/v1/monitoring/health 200 OK 12ms" },
  { id: "live-2", timestamp: "11:13:05", severity: "debug", module: "Redis", message: "Cache hit for key 'tenant:config:t-8841'" },
  { id: "live-3", timestamp: "11:13:10", severity: "info", module: "Queue", message: "Job 'email-digest:1842' completed successfully" },
  { id: "live-4", timestamp: "11:13:15", severity: "info", module: "API", message: "POST /api/v1/auth/refresh 201 Created 85ms" },
];

// const liveModules = ["API", "Redis", "Queue", "Database", "Billing", "Tenant Activity", "Auth"];
const liveMessages = [
  { severity: "info", module: "API", message: "GET /api/v1/users/profile 200 OK 32ms" },
  { severity: "debug", module: "Redis", message: "Set key 'session:token:usr_992' with TTL 3600" },
  { severity: "info", module: "Queue", message: "Job 'invoice:charge:9912' picked up by worker 'us-east-worker-01'" },
  { severity: "info", module: "Database", message: "INSERT INTO audit_logs (id, event, user_id) VALUES ($1, $2, $3)" },
  { severity: "warning", module: "API", message: "GET /api/v1/ai/generate 429 Too Many Requests 8ms" },
  { severity: "info", module: "Auth", message: "MFA Token successfully validated for user 'Ada Turing'" },
];

export function generateRandomLiveLog(idIndex: number): LogEntry {
  const date = new Date();
  const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  const randomMsg = liveMessages[Math.floor(Math.random() * liveMessages.length)];
  return {
    id: `live-generated-${idIndex}`,
    timestamp: timeStr,
    severity: randomMsg.severity as "info" | "warning" | "error" | "debug",
    module: randomMsg.module,
    message: randomMsg.message,
  };
}
