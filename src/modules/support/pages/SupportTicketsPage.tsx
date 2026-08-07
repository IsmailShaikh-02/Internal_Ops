import { useState, useMemo } from "react";
import { useSupportStore } from "../hooks/useSupportState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import { TicketDetailsModal } from "../components/TicketDetailsModal";
import type { SupportTicket } from "../types";
import { Search, Eye, Filter } from "lucide-react";

export function SupportTicketsPage() {
  const { tickets } = useSupportStore();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [agentFilter, setAgentFilter] = useState("all");
  const [tenantFilter, setTenantFilter] = useState("");

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchPriority = priorityFilter === "all" || t.priority === priorityFilter;
      const matchCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchAgent = agentFilter === "all" || t.assignedAgent === agentFilter;
      const matchTenant = !tenantFilter.trim() || t.tenant.toLowerCase().includes(tenantFilter.toLowerCase());
      return matchStatus && matchPriority && matchCategory && matchAgent && matchTenant;
    });
  }, [tickets, statusFilter, priorityFilter, categoryFilter, agentFilter, tenantFilter]);

  const uniqueAgents = useMemo(() => {
    return Array.from(new Set(tickets.map((t) => t.assignedAgent)));
  }, [tickets]);

  const getPriorityBadgeVariant = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "critical": return "critical";
      case "high": return "warning";
      case "medium": return "info";
      default: return "neutral";
    }
  };

  const getStatusBadgeVariant = (status: SupportTicket["status"]) => {
    switch (status) {
      case "closed": return "neutral";
      case "resolved": return "success";
      case "investigation": return "warning";
      case "internal_discussion": return "info";
      default: return "info";
    }
  };

  const columns = [
    {
      key: "ticketNumber",
      header: "Ticket ID",
      className: "font-mono font-bold text-slate-800 text-xs",
    },
    {
      key: "tenant",
      header: "Tenant",
      className: "text-sm font-semibold text-slate-700",
    },
    {
      key: "subject",
      header: "Subject",
      className: "text-sm text-slate-900 max-w-xs truncate",
      render: (row: SupportTicket) => (
        <div>
          <p className="font-semibold truncate">{row.subject}</p>
          {row.slaBreached && (
            <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider block w-max mt-0.5">
              SLA Breached
            </span>
          )}
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      className: "text-xs font-semibold text-slate-500",
    },
    {
      key: "priority",
      header: "Priority",
      render: (row: SupportTicket) => (
        <StatusBadge variant={getPriorityBadgeVariant(row.priority)}>
          {row.priority.toUpperCase()}
        </StatusBadge>
      ),
    },
    {
      key: "assignedAgent",
      header: "Assigned Agent",
      className: "text-xs font-semibold text-slate-700",
    },
    {
      key: "createdDate",
      header: "Created",
      className: "text-xs text-slate-500",
    },
    {
      key: "status",
      header: "Status",
      render: (row: SupportTicket) => (
        <StatusBadge variant={getStatusBadgeVariant(row.status)}>
          {row.status.replace("_", " ").toUpperCase()}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row: SupportTicket) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 rounded-lg text-xs font-bold py-1 h-7 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedTicket(row);
            setIsDetailsOpen(true);
          }}
        >
          <Eye className="h-3 w-3" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filtering Header Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Status filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="investigation">Investigation</option>
              <option value="internal_discussion">Internal Discussion</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Category filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Security">Security</option>
              <option value="Billing">Billing</option>
              <option value="Integrations">Integrations</option>
              <option value="HRMS">HRMS</option>
              <option value="Troubleshooting">Troubleshooting</option>
            </select>
          </div>

          {/* Agent filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Assigned Agent
            </label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Agents</option>
              {uniqueAgents.map((agent) => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          {/* Tenant Search input */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Search Tenant
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
                placeholder="Search tenant name..."
                className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* DataTable listing tickets */}
      <DataTable
        data={filteredTickets}
        columns={columns}
        rowKey={(row) => row.id}
        searchable
        searchPlaceholder="Filter subjects & numbers..."
        searchFields={["ticketNumber", "subject", "tenant"]}
        pageSize={6}
        emptyMessage="No tickets found matching the filters."
      />

      {/* Ticket Details Panel Modal */}
      {selectedTicket && (
        <TicketDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setSelectedTicket(null);
          }}
          ticket={selectedTicket}
        />
      )}
    </div>
  );
}
export default SupportTicketsPage;
