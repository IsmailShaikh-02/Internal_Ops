// src/modules/monitor/pages/DatabaseMonitoringPage.tsx

import { useState } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { databaseMetricsMock } from "../data/mockData";
import { type DatabaseMetrics } from "../types";
import { toast } from "sonner";
import { Database, Download, AlertTriangle } from "lucide-react";

export default function DatabaseMonitoringPage() {
  const [selectedDb, setSelectedDb] = useState<DatabaseMetrics | null>(null);

  const handleExportReport = (dbName: string) => {
    toast.success(`Generated database performance report for ${dbName}. Download starting...`);
  };

  const columns = [
    {
      key: "name",
      header: "Database Name",
      render: (row: DatabaseMetrics) => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: DatabaseMetrics) => {
        const variant = row.status === "online" || row.status === "replicating" ? "success" : "critical";
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "activeConnections",
      header: "Connections",
      render: (row: DatabaseMetrics) => <span>{row.activeConnections} active</span>,
    },
    {
      key: "slowQueriesCount",
      header: "Slow Queries (24h)",
      render: (row: DatabaseMetrics) => (
        <span className={`font-semibold ${row.slowQueriesCount > 0 ? "text-red-500 font-bold" : "text-slate-600"}`}>
          {row.slowQueriesCount}
        </span>
      ),
    },
    {
      key: "replicationStatus",
      header: "Replication",
      render: (row: DatabaseMetrics) => {
        const variant = row.replicationStatus === "healthy" ? "success" : "warning";
        return <StatusBadge variant={variant}>{row.replicationStatus}</StatusBadge>;
      },
    },
    {
      key: "storageUsage",
      header: "Size on Disk",
      render: (row: DatabaseMetrics) => <span>{row.storageUsage} GB</span>,
    },
    {
      key: "queryPerformance",
      header: "Throughput (QPS)",
      render: (row: DatabaseMetrics) => <span>{row.queryPerformance} QPS</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: DatabaseMetrics) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (row.slowQueries.length > 0) {
                setSelectedDb(row);
              } else {
                toast.info("No slow queries recorded in the last 24 hours.");
              }
            }}
          >
            Slow Queries
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportReport(row.name)}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        <DataTable
          title="Active PostgreSQL Cluster"
          data={databaseMetricsMock}
          columns={columns}
          rowKey={(row) => row.name}
        />

        {/* Slow Queries Modal */}
        {selectedDb && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-xl border flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-bold text-lg text-slate-800">
                    Slow Queries: {selectedDb.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDb(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {selectedDb.slowQueries.map((query) => (
                  <div key={query.id} className="p-4 border rounded-lg bg-slate-50 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500">ID: {query.id}</span>
                      <span className="font-mono text-slate-400">{query.timestamp}</span>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                      {query.query}
                    </div>

                    <div className="flex justify-between items-center text-xs mt-1">
                      <span className="text-red-600 font-bold">
                        Execution time: {query.duration} ms
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[10px]"
                        onClick={() => toast.info(`Running EXPLAIN ANALYZE command on query ${query.id}`)}
                      >
                        Explain Query
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" onClick={() => setSelectedDb(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MonitoringLayout>
  );
}
