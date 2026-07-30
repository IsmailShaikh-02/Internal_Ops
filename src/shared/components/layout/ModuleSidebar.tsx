import { useLocation, useNavigate } from "react-router-dom";
import { navigation } from "@/app/config/navigation";

export function ModuleSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Find active module by matching current pathname prefix
  const activeModule = navigation.find((module) => {
    if (module.path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(module.path);
  }) || navigation[0];

  const sidebarFooters: Record<string, string> = {
    dashboard: "Platform-wide KPIs, revenue and health at a glance.",
    tenants: "Provision, monitor and administer customer organizations.",
    billing: "Plans, invoices, revenue and finance operations.",
  };

  return (
    <aside className="w-60 border-r border-slate-200 bg-white flex flex-col min-h-screen">
      {/* Module Title Header */}
      <div className="px-6 border-b border-slate-200 min-h-14 flex flex-col justify-center">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Module
        </span>
        <h2 className="text-base font-semibold text-slate-800 tracking-tight leading-tight">
          {activeModule.title}
        </h2>
      </div>

      {/* Module Overview Navigation */}
      <div className="mt-6 px-3 flex-1 overflow-y-auto">
        {activeModule.children.length > 0 && (
          <div className="space-y-4">
            {activeModule.children[0].group ? (
              // Grouped Render
              (() => {
                const groups: Record<string, typeof activeModule.children> = {};
                activeModule.children.forEach(item => {
                  const g = item.group || "OTHER";
                  if (!groups[g]) groups[g] = [];
                  groups[g].push(item);
                });
                return Object.entries(groups).map(([groupName, items]) => (
                  <div key={groupName} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-1">
                      {groupName}
                    </span>
                    <nav className="space-y-0.5">
                      {items.map((item) => {
                        const isActive =
                          location.pathname === item.path ||
                          (item.path !== "/" && location.pathname.startsWith(item.path + "/"));

                        return (
                          <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex w-full items-center px-3 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                              isActive
                                ? "text-slate-900 bg-slate-100 font-bold"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold"
                            }`}
                          >
                            {item.title}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                ));
              })()
            ) : (
              // Flat Render
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">
                  {activeModule.title === "Tenant Management" ? "Tenants" : "Overview"}
                </span>
                <nav className="space-y-1">
                  {activeModule.children.map((item) => {
                    const displayTitle = item.title === "Overview" ? "Platform Overview" : item.title;
                    const isActive =
                      location.pathname === item.path ||
                      (item.path !== "/" && location.pathname.startsWith(item.path + "/"));

                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer ${
                          isActive
                            ? "text-slate-900 bg-slate-100 font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold"
                        }`}
                      >
                        {displayTitle}
                      </button>
                    );
                  })}
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Branding Info */}
      <div className="p-3.5 border-t border-slate-200">
        <p className="text-xs text-slate-500 leading-normal tracking-wide">
          {sidebarFooters[activeModule.id] || "Platform management and monitoring console."}
        </p>
      </div>
    </aside>
  );
}