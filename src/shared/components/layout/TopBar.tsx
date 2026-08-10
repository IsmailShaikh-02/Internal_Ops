// src/shared/components/layout/TopBar.tsx
import { useState, useEffect, useRef } from "react";
import { Search, Plus, HelpCircle, Bell, Monitor, Building, FileText, Terminal, ArrowRight, Sparkles, X } from "lucide-react";
import { useCommandSearch } from "../../hooks/useCommandSearch";
import type { SearchItem } from "../../workers/search.worker";
import { useNavigate } from "react-router-dom";

export function TopBar() {
  const navigate = useNavigate();
  const { query, setQuery, results, isSearching } = useCommandSearch();
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recent_searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches(["Acme", "INV-2026", "Billing Plans", "SLA"]);
      }
    } else {
      const defaults = ["Acme", "INV-2026", "Billing Plans", "SLA"];
      setRecentSearches(defaults);
      localStorage.setItem("recent_searches", JSON.stringify(defaults));
    }
  }, []);

  // Save query to localStorage
  const saveSearchQuery = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm) return;
    
    // De-duplicate and limit to top 5
    const updated = [
      cleanTerm,
      ...recentSearches.filter((x) => x.toLowerCase() !== cleanTerm.toLowerCase())
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // Listen for the custom event to focus the search bar
  useEffect(() => {
    const handleFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        setIsFocused(true);
      }
    };

    window.addEventListener("focus-top-search", handleFocus);
    return () => {
      window.removeEventListener("focus-top-search", handleFocus);
    };
  }, []);

  // Handle clicking outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const frequentCommands = [
    { title: "Create Tenant", path: "/tenants/create" },
    { title: "Billing Plans", path: "/billing/plans" },
    { title: "Bug Reports", path: "/support/bugs" },
    { title: "Platform Users", path: "/users" },
  ];

  const getIcon = (type: SearchItem["type"]) => {
    switch (type) {
      case "screen":
        return <Monitor className="h-4 w-4 text-emerald-600" />;
      case "tenant":
        return <Building className="h-4 w-4 text-sky-600" />;
      case "invoice":
        return <FileText className="h-4 w-4 text-amber-600" />;
      case "log":
        return <Terminal className="h-4 w-4 text-rose-600" />;
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

  const handleItemClick = (title: string, path: string) => {
    saveSearchQuery(title);
    navigate(path);
    setIsFocused(false);
  };

  return (
    <>
      {/* Full-Screen Blur Backdrop */}
      {isFocused && (
        <div
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-40 transition-all duration-200"
          onClick={() => setIsFocused(false)}
          aria-hidden="true"
        />
      )}

      <header className="h-14 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4 md:px-6 shrink-0 relative z-50">
        
        {/* Search Input Container */}
        <div ref={containerRef} className="relative w-full md:w-[28rem] z-50">
          <div className="relative shadow-xs rounded-lg">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search tenants, invoices, users, logs..."
              className="w-full h-9 pl-9 pr-16 text-sm bg-white border border-slate-200 rounded-lg placeholder-slate-400 focus:outline-none focus:border-slate-350 focus:ring-1 focus:ring-slate-350 transition"
              aria-label="Console search query input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {isFocused && query ? (
                <button 
                  onClick={() => setQuery("")}
                  className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[9px] font-bold text-slate-400 pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              )}
            </div>
          </div>

          {/* Live Search Results Dropdown Overlay (Light Premium UI) */}
          {isFocused && (
            <div className="absolute top-11 left-0 w-screen max-w-[95vw] md:max-w-none md:w-[32rem] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md p-4 shadow-2xl animate-fade-in text-slate-800 max-h-[70vh] overflow-y-auto">
              {query ? (
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {isSearching ? "Searching..." : `Results (${results.length})`}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-emerald-600 animate-spin" /> Sub-5ms
                    </span>
                  </div>

                  {results.length > 0 ? (
                    <div className="space-y-1.5">
                      {results.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.title, item.path)}
                          className="flex w-full items-start gap-3 p-2.5 rounded-lg bg-slate-50/50 border border-slate-100 hover:border-slate-200 hover:bg-slate-100/80 transition text-left cursor-pointer active:scale-[0.99]"
                        >
                          <div className="mt-0.5 rounded-md bg-slate-100 p-1.5 shrink-0">
                            {getIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800 truncate">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${
                                  item.badge === "Overdue" || item.badge === "Alert"
                                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                                    : item.badge.startsWith("SLA Platinum")
                                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-650"
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">
                              {item.subtitle || item.path}
                            </p>
                            <span className="inline-block text-[8px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">
                              {getTypeLabel(item.type)}
                            </span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-slate-400 self-center shrink-0" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <Search className="h-6 w-6 text-slate-300 mb-2" />
                      <span className="text-xs font-bold">No results found</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Initial State when empty (Recent Searches & Frequent Shortcuts) */
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                      Recent Searches
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuery(term)}
                          className="text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-slate-600 px-3 py-1.5 rounded-full transition cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
                      Frequent Shortcuts
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {frequentCommands.map((cmd, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleItemClick(cmd.title, cmd.path)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 transition text-left cursor-pointer active:scale-98"
                        >
                          <span className="text-xs font-bold text-slate-600">{cmd.title}</span>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Actions Button */}
          <button className="hidden md:flex items-center gap-1 h-9 rounded-md border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition cursor-pointer">
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            Quick actions
          </button>

          {/* Help icon */}
          <button className="hidden md:flex text-primary hover:bg-slate-200 rounded-md p-1.5 cursor-pointer">
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <button className="hidden md:flex relative text-primary hover:bg-slate-200 rounded-md p-1.5 cursor-pointer">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-1" />

          {/* User Info */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-950 text-white font-extrabold text-xs">
              AT
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-800 leading-tight">
                Ada Turing
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-wide">
                Platform Owner
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}