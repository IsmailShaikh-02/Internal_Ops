// src/modules/monitor/pages/ApiMonitoringPage.tsx

import { useState, useMemo } from "react";
import { MonitoringLayout } from "../components/MonitoringLayout";
import { StatCard } from "@/shared/components/ui/StatCard";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { apiOverallMetrics, apiEndpointsMock } from "../data/mockData";
import { type ApiEndpointMetrics } from "../types";
import { toast } from "sonner";
import { Activity, ShieldAlert, Clock, ArrowUpRight, Filter } from "lucide-react";

export default function ApiMonitoringPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredEndpoints = useMemo(() => {
    return apiEndpointsMock.filter((api) => {
      const matchesMethod = selectedMethod === "ALL" || api.method === selectedMethod;
      const matchesSearch = api.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMethod && matchesSearch;
    });
  }, [selectedMethod, searchQuery]);

  const columns = [
    {
      key: "endpoint",
      header: "API Endpoint",
      render: (row: ApiEndpointMetrics) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              row.method === "GET"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : row.method === "POST"
                ? "bg-green-50 text-green-700 border border-green-200"
                : row.method === "DELETE"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {row.method}
          </span>
          <code className="text-xs font-semibold text-slate-700">{row.endpoint}</code>
        </div>
      ),
    },
    {
      key: "requests",
      header: "Requests (Last 24h)",
      render: (row: ApiEndpointMetrics) => <span>{row.requests.toLocaleString()}</span>,
    },
    {
      key: "responseTime",
      header: "Avg Latency",
      render: (row: ApiEndpointMetrics) => {
        const isSlow = row.responseTime > 500;
        return (
          <span className={`font-medium ${isSlow ? "text-amber-600 font-bold" : "text-slate-800"}`}>
            {row.responseTime} ms
          </span>
        );
      },
    },
    {
      key: "successRate",
      header: "Success Rate",
      render: (row: ApiEndpointMetrics) => {
        const isHigh = row.successRate >= 99.0;
        return (
          <StatusBadge variant={isHigh ? "success" : "warning"}>
            {row.successRate.toFixed(1)}%
          </StatusBadge>
        );
      },
    },
    {
      key: "errorRate",
      header: "Error Rate",
      render: (row: ApiEndpointMetrics) => {
        const hasErrors = row.errorRate > 1.0;
        return (
          <span className={`font-semibold ${hasErrors ? "text-red-600" : "text-slate-500"}`}>
            {row.errorRate.toFixed(1)}%
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row: ApiEndpointMetrics) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info(`Viewing historical details for ${row.method} ${row.endpoint}`)}
        >
          View Chart
        </Button>
      ),
    },
  ];

  return (
    <MonitoringLayout>
      <div className="space-y-6">
        {/* KPI section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="API Availability"
            value={`${apiOverallMetrics.availability}%`}
            subtitle="Target 99.9%"
            icon={<Activity className="h-4 w-4 text-emerald-500" />}
            trend={{ value: "Healthy", direction: "up" }}
          />
          <StatCard
            title="Overall Response Time"
            value={`${apiOverallMetrics.responseTime} ms`}
            subtitle="Average across all endpoints"
            icon={<Clock className="h-4 w-4 text-blue-500" />}
            trend={{ value: "Steady", direction: "neutral" }}
          />
          <StatCard
            title="Total Requests (24h)"
            value={apiOverallMetrics.requestCount.toLocaleString()}
            subtitle="Edge HTTP logs"
            icon={<ArrowUpRight className="h-4 w-4 text-violet-500" />}
            trend={{ value: "+12.4%", direction: "up" }}
          />
          <StatCard
            title="Overall Error Rate"
            value={`${apiOverallMetrics.errorRate}%`}
            subtitle="Target < 0.20%"
            icon={<ShieldAlert className="h-4 w-4 text-red-500" />}
            trend={{ value: "-0.02%", direction: "up" }}
          />
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-xl bg-card shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-600">Filters:</span>
            <div className="flex border rounded-lg overflow-hidden bg-slate-50">
              {["ALL", "GET", "POST", "PUT", "DELETE"].map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`px-3 py-1.5 text-xs font-semibold cursor-pointer border-r last:border-r-0 ${
                    selectedMethod === method
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-xs w-60 bg-white"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedMethod("ALL");
                toast.success("Filters cleared");
              }}
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Endpoints Table */}
        <DataTable
          title="API Endpoint Statistics"
          data={filteredEndpoints}
          columns={columns}
          rowKey={(row) => `${row.method}-${row.endpoint}`}
        />
      </div>
    </MonitoringLayout>
  );
}
