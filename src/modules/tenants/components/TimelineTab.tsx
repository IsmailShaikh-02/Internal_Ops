import { mockTimelineEvents } from "../data/mockTabDetails";
import { type Tenant } from "../data/mockTenants";
import { CheckCircle2, Info, AlertTriangle, AlertCircle } from "lucide-react";

interface TimelineTabProps {
  tenant: Tenant;
}

const iconMap = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  info: <Info className="h-4 w-4 text-blue-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  danger: <AlertCircle className="h-4 w-4 text-red-600" />,
};

const borderBgMap = {
  success: "border-emerald-200 bg-emerald-50",
  info: "border-blue-200 bg-blue-50",
  warning: "border-amber-200 bg-amber-50",
  danger: "border-red-200 bg-red-50",
};

export default function TimelineTab({ tenant }: TimelineTabProps) {
  const events = mockTimelineEvents[tenant.id] || [
    {
      id: "default",
      title: "Tenant Created",
      description: `Tenant workspace initialized successfully under ${tenant.plan} plan.`,
      date: tenant.createdDate,
      type: "success" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Tenant Timeline</h3>
        <p className="text-xs text-slate-500 mt-0.5">Historical timeline showing major lifecycle events, upgrades and system-wide incidents.</p>
      </div>

      <div className="relative pl-6 border-l border-slate-200 ml-4 space-y-8 my-4">
        {events.map((event) => (
          <div key={event.id} className="relative">
            {/* Timeline Circle Icon */}
            <span className={`absolute -left-[35px] top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-white ${borderBgMap[event.type] || "border-slate-200 bg-slate-50"}`}>
              {iconMap[event.type] || <Info className="h-4 w-4 text-slate-500" />}
            </span>

            {/* Event Content */}
            <div className="border border-slate-200 rounded-xl bg-white p-5 shadow-xs max-w-2xl">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <h4 className="font-bold text-slate-800 text-sm">{event.title}</h4>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{event.date}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed mt-2.5">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
