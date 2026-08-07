import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSupportStore } from "../hooks/useSupportState";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// Import Modals
import { CreateTicketModal } from "../components/CreateTicketModal";
import { CreateBugModal } from "../components/CreateBugModal";
import { CreateFeatureRequestModal } from "../components/CreateFeatureRequestModal";
import { CreateCustomerRequestModal } from "../components/CreateCustomerRequestModal";
import { CreateAnnouncementModal } from "../components/CreateAnnouncementModal";
import { CreateArticleModal } from "../components/CreateArticleModal";

export function SupportLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state and actions from store
  const {
    tickets,
    bugs,
    featureRequests,
    customerRequests,
    addTicket,
    addBug,
    addFeatureRequest,
    addCustomerRequest,
    addAnnouncement,
    addArticle
  } = useSupportStore();

  // Modal open states
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isBugOpen, setIsBugOpen] = useState(false);
  const [isFeatureOpen, setIsFeatureOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  useEffect(() => {
    const openTicket = () => setIsTicketOpen(true);
    const openBug = () => setIsBugOpen(true);
    const openFeature = () => setIsFeatureOpen(true);
    const openCustomer = () => setIsCustomerOpen(true);
    const openAnnounce = () => setIsAnnounceOpen(true);
    const openArticle = () => setIsArticleOpen(true);

    window.addEventListener("open-create-ticket-modal", openTicket);
    window.addEventListener("open-report-bug-modal", openBug);
    window.addEventListener("open-submit-feature-modal", openFeature);
    window.addEventListener("open-create-customer-request-modal", openCustomer);
    window.addEventListener("open-create-announcement-modal", openAnnounce);
    window.addEventListener("open-create-article-modal", openArticle);

    return () => {
      window.removeEventListener("open-create-ticket-modal", openTicket);
      window.removeEventListener("open-report-bug-modal", openBug);
      window.removeEventListener("open-submit-feature-modal", openFeature);
      window.removeEventListener("open-create-customer-request-modal", openCustomer);
      window.removeEventListener("open-create-announcement-modal", openAnnounce);
      window.removeEventListener("open-create-article-modal", openArticle);
    };
  }, []);

  // Tab definitions
  const tabs = [
    { name: "Dashboard", path: "/support/dashboard" },
    { name: "Tickets", path: "/support/tickets", count: tickets.filter(t => t.status !== "closed" && t.status !== "resolved").length },
    { name: "Bug Reports", path: "/support/bugs", count: bugs.filter(b => b.status !== "closed" && b.status !== "fixed").length },
    { name: "Feature Requests", path: "/support/features", count: featureRequests.filter(f => f.status === "new" || f.status === "under_review").length },
    { name: "Customer Requests", path: "/support/customer-requests", count: customerRequests.filter(r => r.status === "new" || r.status === "in_progress").length },
    { name: "Announcements", path: "/support/announcements" },
    { name: "Knowledge Articles", path: "/support/knowledge" },
  ];

  // Determine path-specific actions
  const renderActionButtons = () => {
    const path = location.pathname;
    
    if (path.startsWith("/support/tickets")) {
      return (
        <Button
          onClick={() => setIsTicketOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create ticket
        </Button>
      );
    }
    if (path.startsWith("/support/bugs")) {
      return (
        <Button
          onClick={() => setIsBugOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Report bug
        </Button>
      );
    }
    if (path.startsWith("/support/features")) {
      return (
        <Button
          onClick={() => setIsFeatureOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Submit request
        </Button>
      );
    }
    if (path.startsWith("/support/customer-requests")) {
      return (
        <Button
          onClick={() => setIsCustomerOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create request
        </Button>
      );
    }
    if (path.startsWith("/support/announcements")) {
      return (
        <Button
          onClick={() => setIsAnnounceOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New announcement
        </Button>
      );
    }
    if (path.startsWith("/support/knowledge")) {
      return (
        <Button
          onClick={() => setIsArticleOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-1.5 font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Create article
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <span>Platform</span>
        <span>&gt;</span>
        <span className="text-slate-800">Support Center</span>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Support Center</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Customer tickets, bug reports, requests, announcements and the knowledge base.
          </p>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          {renderActionButtons()}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-6 min-w-max pb-px">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
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
                  {tab.count !== undefined && tab.count > 0 && (
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
      <Outlet />

      {/* Modals Containers */}
      <CreateTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onSubmit={(data) => {
          addTicket(data);
          toast.success("Support ticket successfully created!");
        }}
      />
      <CreateBugModal
        isOpen={isBugOpen}
        onClose={() => setIsBugOpen(false)}
        onSubmit={(data) => {
          addBug(data);
          toast.success("Bug report successfully submitted!");
        }}
      />
      <CreateFeatureRequestModal
        isOpen={isFeatureOpen}
        onClose={() => setIsFeatureOpen(false)}
        onSubmit={(data) => {
          addFeatureRequest(data);
          toast.success("Feature request submitted!");
        }}
      />
      <CreateCustomerRequestModal
        isOpen={isCustomerOpen}
        onClose={() => setIsCustomerOpen(false)}
        onSubmit={(data) => {
          addCustomerRequest(data);
          toast.success("Customer service request logged!");
        }}
      />
      <CreateAnnouncementModal
        isOpen={isAnnounceOpen}
        onClose={() => setIsAnnounceOpen(false)}
        onSubmit={(data) => {
          addAnnouncement(data);
          toast.success("Announcement successfully posted!");
        }}
      />
      <CreateArticleModal
        isOpen={isArticleOpen}
        onClose={() => setIsArticleOpen(false)}
        onSubmit={(data) => {
          addArticle(data);
          toast.success("Knowledge article created!");
        }}
      />
    </div>
  );
}
export default SupportLayout;
