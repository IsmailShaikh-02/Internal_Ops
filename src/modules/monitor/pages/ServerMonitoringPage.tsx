// src/modules/monitor/pages/ServerMonitoringPage.tsx

import { useState } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { serversMock } from "../data/mockData";
import { type ServerInfo } from "../types";
import { toast } from "sonner";
import { RefreshCw, Download, Server } from "lucide-react";

export default function ServerMonitoringPage() {
  const [servers, setServers] = useState<ServerInfo[]>(serversMock);
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null);

  const handleRestartService = (serverId: string, processName: string) => {
    toast.success(`Sent restart signal to '${processName}' on ${serverId}`);
  };

  const handleRestartServer = (serverId: string) => {
    toast.info(`Initiated restart for server ${serverId}. This will take a few minutes.`);
    setServers((prev) =>
      prev.map((srv) =>
        srv.id === serverId ? { ...srv, status: "maintenance", cpuUsage: 0 } : srv
      )
    );
    setTimeout(() => {
      setServers((prev) =>
        prev.map((srv) =>
          srv.id === serverId ? { ...srv, status: "online", cpuUsage: 15 } : srv
        )
      );
      toast.success(`Server ${serverId} is back online!`);
    }, 4000);
  };

  const columns = [
    {
      key: "name",
      header: "Server Name",
      render: (row: ServerInfo) => (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: ServerInfo) => {
        const variant =
          row.status === "online"
            ? "success"
            : row.status === "maintenance"
            ? "warning"
            : "critical";
        return <StatusBadge variant={variant}>{row.status}</StatusBadge>;
      },
    },
    {
      key: "cpuUsage",
      header: "CPU Usage",
      render: (row: ServerInfo) => (
        <div className="flex items-center gap-2">
          <span className="w-10 text-right">{row.cpuUsage}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${row.cpuUsage}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "memoryUsage",
      header: "Memory Usage",
      render: (row: ServerInfo) => (
        <div className="flex items-center gap-2">
          <span className="w-10 text-right">{row.memoryUsage}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${row.memoryUsage}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "diskUsage",
      header: "Disk Usage",
      render: (row: ServerInfo) => (
        <div className="flex items-center gap-2">
          <span className="w-10 text-right">{row.diskUsage}%</span>
          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${row.diskUsage}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: "networkUsage",
      header: "Network (Rx/Tx)",
      render: (row: ServerInfo) => (
        <span className="text-xs text-muted-foreground">
          ↓ {row.networkUsage.rx} / ↑ {row.networkUsage.tx}
        </span>
      ),
    },
    {
      key: "lastRestart",
      header: "Last Restart",
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: ServerInfo) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedServer(row)}>
            Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            disabled={row.status === "maintenance"}
            onClick={() => handleRestartServer(row.name)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        <DataTable
          title="Active Application Servers"
          data={servers}
          columns={columns}
          rowKey={(row) => row.id}
          searchable
          searchPlaceholder="Search servers..."
          searchFields={["name", "status"]}
        />

        {/* Selected Server Details Modal */}
        {selectedServer && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border flex flex-col gap-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-slate-800">{selectedServer.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedServer(null)}
                  className="text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Resource grid */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-semibold">CPU</div>
                  <div className="text-lg font-bold">{selectedServer.cpuUsage}%</div>
                </div>
                <div className="text-center border-x">
                  <div className="text-xs text-muted-foreground font-semibold">MEMORY</div>
                  <div className="text-lg font-bold">{selectedServer.memoryUsage}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-semibold">DISK</div>
                  <div className="text-lg font-bold">{selectedServer.diskUsage}%</div>
                </div>
              </div>

              {/* Processes list */}
              <div>
                <h4 className="font-bold text-sm text-slate-700 mb-2">Running Processes</h4>
                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                  {selectedServer.processes.map((proc) => (
                    <div key={proc.pid} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{proc.name}</span>
                        <span className="text-slate-400">PID: {proc.pid} • {proc.status}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600">CPU: {proc.cpu}% • RAM: {proc.memory}MB</span>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] px-2"
                            onClick={() => handleRestartService(selectedServer.name, proc.name)}
                          >
                            Restart
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[10px] px-2"
                            onClick={() => toast.info(`Downloading process logs for PID ${proc.pid}`)}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" onClick={() => setSelectedServer(null)}>
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
