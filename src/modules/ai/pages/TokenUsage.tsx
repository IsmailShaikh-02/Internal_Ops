import { useAiStore } from "../hooks/useAiState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { Button } from "@/shared/components/ui/button";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";

export function TokenUsage() {
  const { tokenUsage } = useAiStore();

  const handleExport = () => {
    toast.success("Token usage report exported successfully as CSV.");
  };

  const handleViewDetails = (tenant: string) => {
    toast.info(`Opening usage details for tenant: ${tenant}`);
  };

  // Columns configuration
  const columns = [
    {
      key: "tenant",
      header: "Tenant",
      render: (row: any) => (
        <span className="font-semibold text-slate-800">{row.tenant}</span>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (row: any) => (
        <span className="text-slate-500 font-mono text-xs">{row.user}</span>
      ),
    },
    {
      key: "model",
      header: "AI Model",
      render: (row: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          {row.model}
        </span>
      ),
    },
    {
      key: "promptTokens",
      header: "Prompt Tokens",
      render: (row: any) => (
        <span className="font-mono text-sm text-slate-600">
          {row.promptTokens.toLocaleString()}
        </span>
      ),
    },
    {
      key: "completionTokens",
      header: "Completion Tokens",
      render: (row: any) => (
        <span className="font-mono text-sm text-slate-600">
          {row.completionTokens.toLocaleString()}
        </span>
      ),
    },
    {
      key: "totalTokens",
      header: "Total Tokens",
      render: (row: any) => (
        <span className="font-mono text-sm font-bold text-slate-900">
          {row.totalTokens.toLocaleString()}
        </span>
      ),
    },
    {
      key: "remainingQuota",
      header: "Remaining Quota",
      render: (row: any) => (
        <span className="font-mono text-sm text-green-600 font-medium">
          {row.remainingQuota.toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: any) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => handleViewDetails(row.tenant)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Table Section */}
      <DataTable
        title="Token Consumption Ledger"
        data={tokenUsage}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search tenant or user..."
        searchFields={["tenant", "user", "model"]}
        showExportButton={true}
        toolbarActions={
          <Button onClick={handleExport} variant="outline" size="sm" className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export Usage
          </Button>
        }
        pageSize={6}
      />
    </div>
  );
}

export default TokenUsage;
