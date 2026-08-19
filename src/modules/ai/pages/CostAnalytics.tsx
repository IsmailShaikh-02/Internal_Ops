import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useAiStore } from "../hooks/useAiState";
import { DataTable } from "@/shared/components/ui/DataTable";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import { StatCard } from "@/shared/components/ui/StatCard";
import { DollarSign, Wallet, Percent, Calendar } from "lucide-react";

// Mock daily cost trend data
const dailyCostTrendData = [
  { day: "Aug 13", cost: 124 },
  { day: "Aug 14", cost: 140 },
  { day: "Aug 15", cost: 132 },
  { day: "Aug 16", cost: 116 },
  { day: "Aug 17", cost: 156 },
  { day: "Aug 18", cost: 168 },
  { day: "Aug 19", cost: 184 },
];

export function CostAnalytics() {
  const { costRecords } = useAiStore();

  // Calculated Stats
  const stats = useMemo(() => {
    const totalCost = costRecords.reduce((sum, r) => sum + r.cost, 0);
    const avgCostPerTenant = totalCost / 4;
    const estMonthlySpend = totalCost * 12.5;

    return {
      dailyCost: 184.00,
      monthlyCost: totalCost,
      costPerTenant: avgCostPerTenant,
      estMonthlySpend
    };
  }, [costRecords]);

  // Aggregate cost by model
  const costByModelData = useMemo(() => {
    const map: Record<string, number> = {};
    costRecords.forEach((r) => {
      map[r.model] = (map[r.model] || 0) + r.cost;
    });
    const colors = ["#0284c7", "#f97316", "#22c55e", "#a855f7"];
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      color: colors[i % colors.length]
    }));
  }, [costRecords]);

  // Aggregate cost by Tenant
  const costByTenantData = useMemo(() => {
    const map: Record<string, number> = {};
    costRecords.forEach((r) => {
      map[r.tenant] = (map[r.tenant] || 0) + r.cost;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      cost: parseFloat(value.toFixed(2))
    })).sort((a, b) => b.cost - a.cost);
  }, [costRecords]);

  // Columns for cost record table
  const columns = [
    {
      key: "date",
      header: "Date",
      render: (row: any) => <span className="text-slate-600 text-xs">{row.date}</span>,
    },
    {
      key: "tenant",
      header: "Tenant",
      render: (row: any) => <span className="font-semibold text-slate-800">{row.tenant}</span>,
    },
    {
      key: "module",
      header: "Module",
      render: (row: any) => <span className="text-slate-600 text-sm">{row.module}</span>,
    },
    {
      key: "model",
      header: "Model",
      render: (row: any) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
          {row.model}
        </span>
      ),
    },
    {
      key: "tokens",
      header: "Tokens Used",
      render: (row: any) => <span className="font-mono text-sm">{row.tokens.toLocaleString()}</span>,
    },
    {
      key: "cost",
      header: "Cost Incurred",
      render: (row: any) => <span className="font-mono text-sm font-bold text-slate-950">${row.cost.toFixed(2)}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Daily AI Cost"
          value={`$${stats.dailyCost.toFixed(2)}`}
          subtitle="Latest 24 hour spend"
          icon={<DollarSign className="h-4 w-4 text-slate-500" />}
          trend={{ value: "+9.2%", direction: "up" }}
        />
        <StatCard
          title="Monthly Cumulative Spend"
          value={`$${stats.monthlyCost.toFixed(2)}`}
          subtitle="August 1 - August 19"
          icon={<Wallet className="h-4 w-4 text-slate-500" />}
          trend={{ value: "-1.8%", direction: "down" }}
        />
        <StatCard
          title="Avg Cost per Tenant"
          value={`$${stats.costPerTenant.toFixed(2)}`}
          subtitle="Distributed average"
          icon={<Percent className="h-4 w-4 text-slate-500" />}
          trend={{ value: "-4.2%", direction: "down" }}
        />
        <StatCard
          title="Estimated Monthly Spend"
          value={`$${stats.estMonthlySpend.toFixed(2)}`}
          subtitle="Projected end of month"
          icon={<Calendar className="h-4 w-4 text-slate-500" />}
          trend={{ value: "On Budget", direction: "neutral" }}
        />
      </div>

      {/* Cost Analytics Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ChartCard title="Daily Cost Trend ($)" description="Daily cumulative spending trend (7d)" contentClassName="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyCostTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: "12px" }} formatter={(val: any) => [`$${val}`, "Cost"]} />
              <Bar dataKey="cost" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard title="Cost by AI Model" description="Expense share per model" contentClassName="h-[250px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="h-[120px] w-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costByModelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={50}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {costByModelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                {costByModelData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-600">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span>{entry.name}: ${entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Cost by Tenant" description="Active tenant consumption share" contentClassName="h-[250px] overflow-y-auto pr-1">
            <div className="space-y-3.5">
              {costByTenantData.map((item) => {
                const max = Math.max(...costByTenantData.map((d) => d.cost));
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.name}</span>
                      <span className="text-slate-500 font-mono">${item.cost}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${(item.cost / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Ledger Table */}
      <DataTable
        title="AI Financial Ledgers"
        data={costRecords}
        columns={columns}
        rowKey={(row) => row.id}
        searchable={true}
        searchPlaceholder="Search tenant or model..."
        searchFields={["tenant", "model"]}
        pageSize={6}
      />
    </div>
  );
}

export default CostAnalytics;
