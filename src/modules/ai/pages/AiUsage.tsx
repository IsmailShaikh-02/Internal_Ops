import { useState, useMemo } from "react";
import { useAiStore } from "../hooks/useAiState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Clock } from "lucide-react";

export function AiUsage() {
  const { usageRequests } = useAiStore();

  // Filters state
  const [selectedTenant, setSelectedTenant] = useState<string>("All");
  const [selectedModule, setSelectedModule] = useState<string>("All");
  const [selectedModel, setSelectedModel] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Get unique options for filters
  const tenants = useMemo(() => ["All", ...Array.from(new Set(usageRequests.map((r) => r.tenant)))], [usageRequests]);
  const modules = useMemo(() => ["All", ...Array.from(new Set(usageRequests.map((r) => r.module)))], [usageRequests]);
  const models = useMemo(() => ["All", ...Array.from(new Set(usageRequests.map((r) => r.modelUsed)))], [usageRequests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return usageRequests.filter((r) => {
      const matchTenant = selectedTenant === "All" || r.tenant === selectedTenant;
      const matchModule = selectedModule === "All" || r.module === selectedModule;
      const matchModel = selectedModel === "All" || r.modelUsed === selectedModel;
      const matchStatus = selectedStatus === "All" || r.status === selectedStatus.toLowerCase();
      return matchTenant && matchModule && matchModel && matchStatus;
    });
  }, [usageRequests, selectedTenant, selectedModule, selectedModel, selectedStatus]);

  // Column definitions
  const columns = [
    {
      key: "tenant",
      header: "Tenant",
      render: (row: any) => (
        <span className="font-semibold text-slate-800">{row.tenant}</span>
      ),
    },
    {
      key: "module",
      header: "Module",
      render: (row: any) => (
        <span className="text-slate-600 text-sm">{row.module}</span>
      ),
    },
    {
      key: "feature",
      header: "AI Feature",
      render: (row: any) => (
        <span className="text-slate-700 font-medium text-sm">{row.feature}</span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (row: any) => (
        <span className="text-slate-500 text-xs font-mono">{row.user}</span>
      ),
    },
    {
      key: "requestTime",
      header: "Request Time",
      render: (row: any) => (
        <span className="text-slate-500 text-xs">{row.requestTime}</span>
      ),
    },
    {
      key: "modelUsed",
      header: "Model Used",
      render: (row: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
          {row.modelUsed}
        </span>
      ),
    },
    {
      key: "processingTime",
      header: "Latency",
      render: (row: any) => (
        <span className="flex items-center gap-1 text-slate-600 text-xs font-mono">
          <Clock className="h-3 w-3 text-slate-400" />
          {row.processingTime} ms
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: any) => (
        <StatusBadge
  variant={row.status === "success" ? "success" : "critical"}
>
  {row.status === "success" ? "Success" : "Failed"}
</StatusBadge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant</label>
          <select
            value={selectedTenant}
            onChange={(e) => setSelectedTenant(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 outline-hidden"
          >
            {tenants.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Module</label>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 outline-hidden"
          >
            {modules.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 outline-hidden"
          >
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[100px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm font-medium text-slate-700 outline-hidden"
          >
            <option value="All">All</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <DataTable
        title="AI Request History"
        data={filteredRequests}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search user or feature..."
        searchFields={["user", "feature", "tenant"]}
        pageSize={7}
      />
    </div>
  );
}

export default AiUsage;
