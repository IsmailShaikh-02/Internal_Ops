// src/modules/monitor/types/index.ts

export type HealthStatus = "healthy" | "degraded" | "critical" | "down";

export interface SystemHealthKPIs {
  overallHealth: HealthStatus;
  uptime: number; // e.g., 99.982
  activeServices: number;
  failedServices: number;
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  activeAlerts: number;
}

export interface MonitoredComponent {
  name: string;
  status: "up" | "degraded" | "down";
  latency?: number;
  message?: string;
}

export interface ServerProcess {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping" | "zombie";
}

export interface ServerInfo {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: { rx: string; tx: string };
  lastRestart: string;
  processes: ServerProcess[];
}

export interface ApiEndpointMetrics {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  requests: number;
  responseTime: number; // ms
  successRate: number; // percentage
  errorRate: number; // percentage
}

export interface ApiOverallMetrics {
  availability: number;
  responseTime: number;
  requestCount: number;
  successRate: number;
  errorRate: number;
  timeoutRate: number;
}

export interface QueueInfo {
  name: string;
  pendingJobs: number;
  processingJobs: number;
  failedJobs: number;
  retryCount: number;
  avgProcessingTime: number; // ms
  status: "active" | "paused" | "draining";
}

export interface RedisMetrics {
  connectionStatus: "connected" | "disconnected";
  memoryUsage: number; // MB
  maxMemory: number; // MB
  cacheHitRatio: number; // percentage
  activeKeys: number;
  expiredKeys: number;
  evictedKeys: number;
}

export interface StorageBreakdown {
  documents: number; // GB
  images: number;
  videos: number;
  attachments: number;
  logs: number;
  backups: number;
}

export interface StorageMetrics {
  totalStorage: number; // GB
  usedStorage: number;
  freeStorage: number;
  backupStorage: number;
  fileCount: number;
  breakdown: StorageBreakdown;
}

export interface SlowQuery {
  id: string;
  query: string;
  duration: number; // ms
  timestamp: string;
  database: string;
}

export interface DatabaseMetrics {
  name: string;
  status: "online" | "replicating" | "offline";
  activeConnections: number;
  slowQueriesCount: number;
  replicationStatus: "healthy" | "lagging" | "stopped";
  storageUsage: number; // GB
  queryPerformance: number; // qps
  slowQueries: SlowQuery[];
}

export interface BackgroundJob {
  id: string;
  name: string;
  queue: string;
  status: "queued" | "processing" | "completed" | "failed";
  executionTime: number; // ms or seconds
  retryCount: number;
  lastRun: string;
  error?: string;
}

export interface ScheduledJob {
  id: string;
  name: string;
  schedule: string; // Cron expression
  lastExecution: string;
  nextExecution: string;
  status: "active" | "paused" | "running";
}

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "debug";
  module: string;
  message: string;
  stackTrace?: string;
  status?: "resolved" | "unresolved";
}
