import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navigation, type NavigationModule } from "@/app/config/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { QuickActionFAB } from "./QuickActionFAB";
import { ActivityAttentionSheet } from "./ActivityAttentionSheet";

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  // Drawer / Bottom sheet state
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"modules" | "submodules">("modules");
  const [selectedModule, setSelectedModule] = useState<NavigationModule | null>(null);

  // Command center and Activity attention hub states
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  const activePath = location.pathname;

  // Determine active module ID for highlights
  const activeModule = navigation.find((module) => {
    if (module.path === "/") {
      return activePath === "/";
    }
    return activePath.startsWith(module.path);
  }) || navigation[0];

  const handleModuleClick = (module: NavigationModule) => {
    if (module.children && module.children.length > 0) {
      setSelectedModule(module);
      setCurrentView("submodules");
    } else {
      navigate(module.path);
      setIsOpen(false);
    }
  };

  const handleSubpageClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* FIXED BOTTOM NAVIGATION BAR (Thumb-First Layout)          */}
      {/* ========================================================= */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-t border-slate-200 bg-white/90 backdrop-blur-md px-4 shadow-lg pb-safe"
      >
        {/* Left Side: Dashboard & Tenants */}
        <div className="flex flex-1 items-center justify-around">
          <button
            type="button"
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition cursor-pointer ${
              activePath === "/" ? "text-slate-900" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/tenants")}
            className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition cursor-pointer ${
              activePath.startsWith("/tenants") ? "text-slate-900" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Tenants</span>
          </button>
        </div>

        {/* Center: Contextual FAB (Floating Action Button) */}
        <div className="relative -top-4 mx-2">
          <QuickActionFAB
            onClick={() => window.dispatchEvent(new CustomEvent("focus-top-search"))}
            onSwipeUp={() => setIsActivityOpen(true)}
          />
        </div>

        {/* Right Side: Billing & All Modules Trigger (Menu) */}
        <div className="flex flex-1 items-center justify-around">
          <button
            type="button"
            onClick={() => navigate("/billing")}
            className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold transition cursor-pointer ${
              activePath.startsWith("/billing") ? "text-slate-900" : "text-slate-400 hover:text-slate-650"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>Billing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCurrentView("modules");
              setSelectedModule(null);
              setIsOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </div>
      </nav>

      {/* ========================================================= */}
      {/* MOBILE FULL MODULES OVERLAY SHEET                         */}
      {/* ========================================================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          {/* Closer overlay */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Sliding Bottom Drawer Sheet */}
          <div className="relative mt-auto w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col z-10 p-6 pb-safe animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              {currentView === "submodules" && selectedModule ? (
                <button
                  onClick={() => setCurrentView("modules")}
                  className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  All Modules
                </button>
              ) : (
                <h3 className="text-sm font-bold text-slate-850 uppercase tracking-wider">
                  Modules Browser
                </h3>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* View content switch */}
            <div className="flex-1 overflow-y-auto min-h-[300px]">
              {currentView === "modules" ? (
                /* Grid of all 12 modules */
                <div className="grid grid-cols-3 gap-3 py-2">
                  {navigation.map((module) => {
                    const Icon = module.icon;
                    const isActive = module.id === activeModule.id;

                    return (
                      <button
                        key={module.id}
                        onClick={() => handleModuleClick(module)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition cursor-pointer gap-2 ${
                          isActive
                            ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                            : "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-500"}`} />
                        <span className="text-[10px] font-bold tracking-tight line-clamp-1">
                          {module.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* List of sub-items for selected module */
                selectedModule && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                      <div className="p-1.5 bg-slate-100 rounded-lg">
                        {<selectedModule.icon className="h-4 w-4 text-slate-600" />}
                      </div>
                      <h4 className="text-base font-bold text-slate-850">{selectedModule.title}</h4>
                    </div>

                    <div className="space-y-1.5">
                      {selectedModule.children.map((item) => {
                        const isSubActive = activePath === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleSubpageClick(item.path)}
                            className={`flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                              isSubActive
                                ? "bg-slate-900 text-white font-bold"
                                : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <span>{item.title}</span>
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Footer with User Account details */}
            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between bg-slate-50/50 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white font-extrabold text-xs">
                  AT
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    Ada Turing
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wide">
                    Platform Owner
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] bg-slate-100 text-slate-650 px-2 py-0.8 rounded-full border border-slate-200 font-bold uppercase tracking-wider">
                <User className="h-3 w-3" />
                Live Session
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity & Attention Hub Bottom Sheet */}
      <ActivityAttentionSheet
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        onNavigate={(path) => navigate(path)}
      />
    </>
  );
}
export default BottomNavigation;