import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useFeatureStore } from "../hooks/useFeatureState";
import { ModuleModal } from "../components/ModuleModal";
import { FeatureFlagModal } from "../components/FeatureFlagModal";
import { TenantOverrideModal } from "../components/TenantOverrideModal";
import { ReleaseModal } from "../components/ReleaseModal";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function FeatureLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Store data
  const {
    modules,
    featureFlags,
    // tenantOverrides,
    releases,
    addModule,
    addFeatureFlag,
    addTenantOverride,
    createRelease
  } = useFeatureStore();

  // Modals visibility state
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isFlagOpen, setIsFlagOpen] = useState(false);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);
  const [isReleaseOpen, setIsReleaseOpen] = useState(false);

  // Sync sub-routes with active tabs
  const tabs = [
    { name: "Modules", path: "/features/modules" },
    { name: "Feature Flags", path: "/features/flags", count: featureFlags.length },
    { name: "Tenant Overrides", path: "/features/overrides" },
    { name: "Plan Feature Mapping", path: "/features/plans" },
    { name: "Release Management", path: "/features/releases" }
  ];

  // Dynamic buttons in the page header depending on active route
  const renderActionButtons = () => {
    if (location.pathname === "/features/modules") {
      return (
        <Button
          onClick={() => setIsModuleOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New module
        </Button>
      );
    }
    if (location.pathname === "/features/flags" || location.pathname === "/features") {
      return (
        <Button
          onClick={() => setIsFlagOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New feature flag
        </Button>
      );
    }
    if (location.pathname === "/features/overrides") {
      return (
        <Button
          onClick={() => setIsOverrideOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add override
        </Button>
      );
    }
    if (location.pathname === "/features/releases") {
      return (
        <Button
          onClick={() => setIsReleaseOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Create release
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      {/* Breadcrumbs */}
      <PageHeader
        breadcrumb={[
          { label: "Platform" },
          { label: "Feature Management" },
          
        ]}
        title="Feature Management"
        description="Modules, feature flags, per-tenant overrides and release pipeline."
        actions={
          <>
            {renderActionButtons()}
          </>
        }
      />
     
      {/* Navigation Tabs */}
<div className="border-b border-slate-200">
  <nav className="flex flex-nowrap md:flex-wrap gap-x-8 gap-y-0 overflow-x-auto md:overflow-x-visible scrollbar-hide">

          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path || (tab.path === "/features/modules" && location.pathname === "/features");
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition duration-150 relative cursor-pointer ${
                  isActive
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-slate-200 text-slate-800" : "bg-slate-100 text-slate-500"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subpage Container */}
      {/* <div className="bg-white rounded-2xl border border-slate-200 p-0 shadow-xs min-h-[500px]"> */}
        <Outlet />
      {/* </div> */}

      {/* Modals Containers */}
      <ModuleModal
        isOpen={isModuleOpen}
        onClose={() => setIsModuleOpen(false)}
        onSubmit={(data) => {
          addModule(data);
          toast.success(`Successfully created module: ${data.displayName}`);
        }}
        modules={modules}
      />

      <FeatureFlagModal
        isOpen={isFlagOpen}
        onClose={() => setIsFlagOpen(false)}
        onSubmit={(data) => {
          addFeatureFlag(data);
          toast.success(`Successfully created feature flag: ${data.name}`);
        }}
        modules={modules}
        featureFlags={featureFlags}
      />

      <TenantOverrideModal
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onSubmit={(data) => {
          addTenantOverride(data);
          toast.success(`Successfully created override for: ${data.tenantName}`);
        }}
        featureFlags={featureFlags}
      />

      <ReleaseModal
        isOpen={isReleaseOpen}
        onClose={() => setIsReleaseOpen(false)}
        onSubmit={(data) => {
          createRelease(data);
          toast.success(`Successfully initialized release: ${data.versionNumber}`);
        }}
        releases={releases}
        featureFlags={featureFlags}
      />
    </div>
  );
}
export default FeatureLayout;
