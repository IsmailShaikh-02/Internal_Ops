// src/modules/security/pages/SecurityDashboardPage.tsx

import { StatCard } from "@/shared/components/ui/StatCard";
import { ChartCard } from "@/shared/components/ui/ChartCard";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Ban,
  Activity,
  AlertTriangle,
  Lock
} from "lucide-react";

export function SecurityDashboardPage() {
  // Simple Premium SVG Chart helpers
  return (
    <div className="space-y-6">
      {/* 1. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Successful Logins"
          value="14,820"
          subtitle="Past 24 hours"
          icon={<ShieldCheck className="h-4 w-4 text-emerald-600" />}
          trend={{ value: "+12.3%", direction: "up" }}
        />
        <StatCard
          title="Failed Login Attempts"
          value="42"
          subtitle="Suspicious thresholds monitored"
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          trend={{ value: "-4.2%", direction: "down" }}
        />
        <StatCard
          title="Locked Accounts"
          value="3"
          subtitle="Temporary lockout applied"
          icon={<Lock className="h-4 w-4 text-rose-600" />}
          trend={{ value: "0%", direction: "neutral" }}
        />
        <StatCard
          title="Active Sessions"
          value="3"
          subtitle="Concurrent logins monitored"
          icon={<Activity className="h-4 w-4 text-blue-600" />}
          trend={{ value: "+2", direction: "up" }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Blocked IP Addresses"
          value="2"
          subtitle="Active perimeter blocks"
          icon={<Ban className="h-4 w-4 text-slate-650" />}
          trend={{ value: "+1", direction: "up" }}
        />
        <StatCard
          title="MFA Enabled Users"
          value="98.4%"
          subtitle="241 / 245 active operators"
          icon={<UserCheck className="h-4 w-4 text-emerald-600" />}
          trend={{ value: "+0.2%", direction: "up" }}
        />
        <StatCard
          title="High-Risk Events"
          value="1"
          subtitle="Requires immediate review"
          icon={<ShieldAlert className="h-4 w-4 text-rose-650" />}
          trend={{ value: "+1", direction: "up" }}
        />
        <StatCard
          title="Security Alerts"
          value="5"
          subtitle="Warning severity events"
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          trend={{ value: "-15%", direction: "down" }}
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend analysis */}
        <ChartCard
          title="Login Trends (24h)"
          description="Successful vs. Failed login distribution hourly"
        >
          <div className="h-64 flex flex-col justify-between">
            {/* Custom SVG line / area chart representation */}
            <div className="flex-1 relative w-full flex items-end">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Successful Logins Grid/Line */}
                <path
                  d="M0 180 Q 80 120, 160 140 T 320 80 T 480 30 T 500 20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <path
                  d="M0 180 Q 80 120, 160 140 T 320 80 T 480 30 T 500 20 L 500 200 L 0 200 Z"
                  fill="url(#greenGradient)"
                  opacity="0.1"
                />

                {/* Failed Logins Line */}
                <path
                  d="M0 195 Q 80 185, 160 190 T 320 195 T 480 170 T 500 190"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold pt-4">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>Now</span>
            </div>
            <div className="flex gap-4 justify-center mt-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" /> Successful
              </span>
              <span className="flex items-center gap-1.5 font-bold text-slate-700">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500 inline-block" /> Failed
              </span>
            </div>
          </div>
        </ChartCard>

        {/* Security Events Severity */}
        <ChartCard
          title="Security Events by Severity"
          description="Incidents categorization by impact scope"
        >
          <div className="h-64 flex flex-col justify-center gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Critical (Immediate Action)</span>
                  <span>1 Event</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-600 h-2 rounded-full" style={{ width: "10%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>High Severity (Urgent Review)</span>
                  <span>4 Events</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Medium Severity (Standard Audit)</span>
                  <span>12 Events</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Low Severity (Info / Status)</span>
                  <span>85 Events</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Login Distribution */}
        <ChartCard
          title="Geographic Login Distribution"
          description="Traffic origins for auth verification requests"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">United States</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">12,450 (84%)</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">Germany</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">1,120 (7.5%)</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">India</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">920 (6.2%)</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="font-semibold text-slate-700">Other Regions</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">330 (2.3%)</span>
            </div>
          </div>
        </ChartCard>

        {/* Device Distribution */}
        <ChartCard
          title="Device & Operating System Distribution"
          description="Top user client profiles"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">macOS (Chrome/Safari)</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">55%</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">Windows (Chrome/Edge)</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">32%</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b pb-2">
              <span className="font-semibold text-slate-700">iOS (Safari Mobile)</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">8%</span>
            </div>
            <div className="flex justify-between items-center text-xs pb-1">
              <span className="font-semibold text-slate-700">Linux / Android</span>
              <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">5%</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

export default SecurityDashboardPage;
