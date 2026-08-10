// src/shared/components/layout/CommandCenterModal.tsx
import { useEffect, useRef } from "react";
import {
  X,
  Search,
  Monitor,
  Building,
  FileText,
  Terminal,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useCommandSearch } from "../../hooks/useCommandSearch";
import type { SearchItem } from "../../workers/search.worker";

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export function CommandCenterModal({
  isOpen,
  onClose,
  onNavigate,
}: CommandCenterModalProps) {
  const { query, setQuery, results, isSearching } = useCommandSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small timeout guarantees browser paints the element and focuses to prompt the keyboard
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const recentSearches = ["Acme", "INV-2026", "Billing Plans", "SLA"];
  const frequentCommands = [
    { title: "Create Tenant", path: "/tenants/create" },
    { title: "Billing Plans", path: "/billing/plans" },
    { title: "Bug Reports", path: "/support/bugs" },
    { title: "Platform Users", path: "/users" },
  ];

  const getIcon = (type: SearchItem["type"]) => {
    switch (type) {
      case "screen":
        return <Monitor className="h-4 w-4 text-emerald-400" />;
      case "tenant":
        return <Building className="h-4 w-4 text-sky-400" />;
      case "invoice":
        return <FileText className="h-4 w-4 text-amber-400" />;
      case "log":
        return <Terminal className="h-4 w-4 text-rose-450" />;
    }
  };

  const getTypeLabel = (type: SearchItem["type"]) => {
    switch (type) {
      case "screen":
        return "Screen";
      case "tenant":
        return "Tenant";
      case "invoice":
        return "Invoice";
      case "log":
        return "System Log";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-100">
      
      {/* Header Search Section */}
      <div className="border-b border-slate-800 bg-slate-950/90 px-4 py-4 sticky top-0 z-10 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens, tenants, invoices, logs..."
            className="w-full rounded-xl bg-slate-900 border border-slate-800 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            aria-label="Console search query input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition cursor-pointer"
          aria-label="Close Command Center"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        {query ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isSearching ? "Searching..." : `Results (${results.length})`}
              </span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-400 animate-spin" /> Sub-5ms Threaded
              </span>
            </div>

            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    className="flex w-full items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-850 hover:border-slate-750 transition text-left cursor-pointer active:scale-[0.99]"
                  >
                    <div className="mt-0.5 rounded-lg bg-slate-800/80 p-2 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-100 truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                            item.badge === "Overdue" || item.badge === "Alert"
                              ? "bg-rose-950/40 border border-rose-900/40 text-rose-350"
                              : item.badge.startsWith("SLA Platinum")
                              ? "bg-emerald-950/40 border border-emerald-900/40 text-emerald-350"
                              : "bg-slate-800 text-slate-400"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">
                        {item.subtitle || item.path}
                      </p>
                      <span className="inline-block text-[8px] font-bold tracking-widest text-slate-500 uppercase mt-1">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-650 self-center shrink-0" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Search className="h-8 w-8 text-slate-750 mb-2" />
                <span className="text-xs font-bold">No results found for "{query}"</span>
                <span className="text-[10px] text-slate-500 mt-1">Check for typos or try general terms</span>
              </div>
            )}
          </div>
        ) : (
          /* Landing Empty State Dashboard */
          <div className="space-y-6">
            
            {/* Recent Searches */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                Recent Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(term)}
                    className="text-xs font-semibold bg-slate-900 border border-slate-850 hover:border-slate-700 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequent Commands */}
            <div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                Frequent Shortcuts
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {frequentCommands.map((cmd, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onNavigate(cmd.path);
                      onClose();
                    }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-750 transition text-left cursor-pointer active:scale-98"
                  >
                    <span className="text-xs font-bold text-slate-200">{cmd.title}</span>
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
export default CommandCenterModal;
