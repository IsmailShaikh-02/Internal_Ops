import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

export function AiLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab definitions
  const tabs = [
    { name: "AI Dashboard", path: "/ai/dashboard" },
    { name: "AI Usage", path: "/ai/usage" },
    { name: "Token Usage", path: "/ai/token-usage" },
    { name: "AI Analytics", path: "/ai/analytics" },
    { name: "Cost Analytics", path: "/ai/cost-analytics" },
    { name: "Prompt Library", path: "/ai/prompt-library" },
    { name: "Prompt Templates", path: "/ai/prompt-templates" },
    { name: "Model Configuration", path: "/ai/model-configuration" },
  ];

  // Render buttons based on location
  const renderActionButtons = () => {
    if (location.pathname === "/ai/prompt-library" || location.pathname === "/ai/prompt-templates") {
      return (
        <Button onClick={() => window.dispatchEvent(new CustomEvent("open-new-prompt-modal"))}>
          <Plus className="h-4 w-4 mr-2" />
          New prompt
        </Button>
      );
    }
    if (location.pathname === "/ai/model-configuration") {
      return (
        <Button onClick={() => window.dispatchEvent(new CustomEvent("open-new-model-modal"))}>
          <Plus className="h-4 w-4 mr-2" />
          Add AI Model
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-full mx-auto flex flex-col gap-6 p-1">
      {/* Breadcrumbs & Header */}
      <div className="flex justify-between items-start">
        <PageHeader
          breadcrumb={[
            { label: "Platform" },
            { label: "AI Administration" },
          ]}
          title="AI Administration"
          description="Models, prompts, token usage and cost governance."
        />
        <div className="mt-14">
          {renderActionButtons()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
  <nav className="flex flex-nowrap md:flex-wrap gap-x-8 gap-y-0 overflow-x-auto md:overflow-x-visible scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`py-3.5 border-b-2 font-semibold text-sm transition duration-150 relative cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "border-slate-800 text-slate-900 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Subpage Content */}
      <Outlet />
    </div>
  );
}

export default AiLayout;
