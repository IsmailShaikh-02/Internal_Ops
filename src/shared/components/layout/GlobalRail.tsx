import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation } from "@/app/config/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GlobalRail() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Find active module by matching current pathname prefix
  const activeModule = navigation.find((module) => {
    if (module.path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(module.path);
  }) || navigation[0];

  const activeModuleId = activeModule.id;

  return (
    <aside
      className={`border-r border-slate-200 bg-slate-50 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center px-5 border-b border-slate-200 min-h-14">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-950 text-white font-bold text-sm tracking-wider">
          IO
        </div>
        {!isCollapsed && (
          <div className="ml-3 transition-opacity duration-300 overflow-hidden whitespace-nowrap">
            <div className="font-semibold text-slate-800 text-sm tracking-tight leading-tight">
              InternalOps
            </div>
            <div className="text-[11px] text-slate-700 tracking-wide leading-tight">
              Platform Console
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navigation.map((module) => {
          const Icon = module.icon;
          const isActive = module.id === activeModuleId;

          return (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className={`flex items-center w-full px-3.5 py-2 rounded-md transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-slate-200 text-slate-900 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200 font-semibold"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-slate-800" : "text-slate-400"}`} />
              {!isCollapsed && (
                <span className="ml-3 text-sm tracking-wide transition-opacity duration-300 overflow-hidden whitespace-nowrap">
                  {module.title}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Action Footer */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center w-full px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-semibold transition"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 text-slate-400" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 text-slate-400" />
              <span className="ml-3 text-sm tracking-wide">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}