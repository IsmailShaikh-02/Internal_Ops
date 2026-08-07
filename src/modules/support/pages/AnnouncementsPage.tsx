import { useSupportStore } from "../hooks/useSupportState";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Announcement } from "../types";
import { Megaphone, Calendar, ShieldAlert, Wrench, Sparkles, RefreshCw, Users } from "lucide-react";

export function AnnouncementsPage() {
  const { announcements } = useSupportStore();

  const getIcon = (type: Announcement["type"]) => {
    switch (type) {
      case "maintenance": return <Wrench className="h-4 w-4 text-amber-600" />;
      case "security_alert": return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case "new_feature": return <Sparkles className="h-4 w-4 text-emerald-600" />;
      case "product_update": return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default: return <Megaphone className="h-4 w-4 text-slate-600" />;
    }
  };

  const getTypeStyle = (type: Announcement["type"]) => {
    switch (type) {
      case "maintenance": return "bg-amber-50 border-amber-200 text-amber-900";
      case "security_alert":
      case "downtime":
        return "bg-red-50 border-red-200 text-red-900";
      case "new_feature": return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case "product_update": return "bg-blue-50 border-blue-200 text-blue-900";
      default: return "bg-slate-50 border-slate-200 text-slate-900";
    }
  };

  const getStatusBadgeVariant = (status: Announcement["status"]) => {
    switch (status) {
      case "published": return "success";
      case "scheduled": return "warning";
      default: return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      {announcements.length === 0 ? (
        <div className="text-center py-12 text-slate-400 font-semibold bg-white border border-slate-200 rounded-xl">
          No announcements published yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition duration-150 flex flex-col justify-between gap-3 ${getTypeStyle(
                ann.type
              )}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/80 rounded-lg shadow-2xs border border-inherit">
                    {getIcon(ann.type)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">{ann.title}</h3>
                    <p className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-70">
                      Type: {ann.type.replace("_", " ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge variant={getStatusBadgeVariant(ann.status)}>
                    {ann.status.toUpperCase()}
                  </StatusBadge>
                </div>
              </div>

              <div className="text-sm font-medium leading-relaxed opacity-95 whitespace-pre-wrap">
                {ann.content}
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-slate-200/50 pt-3 text-xs font-semibold opacity-70">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Target: {ann.targetTenants.join(", ")}
                  </span>
                  {ann.scheduledDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Starts: {new Date(ann.scheduledDate).toLocaleString()}
                    </span>
                  )}
                  {ann.expiryDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Expires: {new Date(ann.expiryDate).toLocaleString()}
                    </span>
                  )}
                </div>
                <span>Created {ann.createdDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default AnnouncementsPage;
