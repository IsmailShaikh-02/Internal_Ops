import { Button } from "@/shared/components/ui/button";
import { PageHeader } from "@/shared/components/layout/PageHeader";

// KPI Cards
import { MrrCard } from "../components/kpi-cards/MrrCard";
import { ArrCard } from "../components/kpi-cards/ArrCard";
import { ActiveTenantsCard } from "../components/kpi-cards/ActiveTenantsCard";
import { ActiveUsersCard } from "../components/kpi-cards/ActiveUsersCard";
import { StorageUsageCard } from "../components/kpi-cards/StorageUsageCard";
import { AiCostCard } from "../components/kpi-cards/AiCostCard";
import { ServerHealthCard } from "../components/kpi-cards/ServerHealthCard";
import { OpenSupportCard } from "../components/kpi-cards/OpenSupportCard";

// Chart and Status Widgets
import { RevenueTrendCard } from "../components/revenue-trend/RevenueTrendCard";
import { SystemStatusCard } from "../components/system-status/SystemStatusCard";

// Analytics Widgets
import { TenantGrowthCard } from "../components/analytics/TenantGrowthCard";
import { ModuleUsageCard } from "../components/analytics/ModuleUsageCard";
import { AiTokenUsageCard } from "../components/analytics/AiTokenUsageCard";

// Tables & Actions
import { RecentTenantsTable } from "../components/tables/RecentTenantsTable";
import { RecentPaymentsTable } from "../components/tables/RecentPaymentsTable";
import { QuickActionsCard } from "../components/actions/QuickActionsCard";

// Mock Data
import { mockDashboardData } from "../data/mockDashboardData";

export default function DashboardPage() {
  const {
    overview,
    revenueTrend,
    systemStatus,
    alerts,
    tenantGrowth,
    moduleUsage,
    aiTokenUsage,
    recentTenants,
    recentPayments,
    quickActions,
  } = mockDashboardData;

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Dashboard" },
        ]}
        title="Platform Overview"
        description="Everything happening across InternalOps — revenue, health and adoption in real time."
        actions={
          <>
            <Button variant="outline">Last 30 days</Button>
            <Button>Export snapshot</Button>
          </>
        }
      />

      {/* KPI Cards Grid */}
      <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MrrCard {...overview.mrr} />
        <ArrCard {...overview.arr} />
        <ActiveTenantsCard {...overview.activeTenants} />
        <ActiveUsersCard {...overview.activeUsers} />
        <StorageUsageCard {...overview.storageUsage} />
        <AiCostCard {...overview.aiSpend} />
        <ServerHealthCard {...overview.serverHealth} />
        <OpenSupportCard {...overview.openTickets} />
      </section>

      {/* Revenue + System Status */}
      <section className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueTrendCard data={revenueTrend} />
        </div>
        <div className="lg:col  -span-1">
          <SystemStatusCard systemStatus={systemStatus} alerts={alerts} />
        </div>
      </section>

      {/* Analytics Widgets (Tenant Growth, Module Usage, AI Token Usage) */}
      <section className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <TenantGrowthCard data={tenantGrowth} />
        <ModuleUsageCard data={moduleUsage} />
        <AiTokenUsageCard data={aiTokenUsage} />
      </section>

      {/* Tables Section */}
      <section className="grid gap-6 grid-cols-1">
        <RecentTenantsTable data={recentTenants} />
        <RecentPaymentsTable data={recentPayments} />
      </section>

      {/* Quick Actions */}
      <section>
        <QuickActionsCard data={quickActions} />
      </section>
    </div>
  );
}