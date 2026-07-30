import { Search, Plus, HelpCircle, Bell } from "lucide-react";

export function TopBar() {
  return (
    <header className="h-14 border-b border-slate-200 bg-slate-50 flex items-center justify-between px-6 shrink-0">
      {/* Search Bar */}
      <div className="relative w-[28rem] shadow-xs rounded-lg">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-primary" />
        </span>
        <input
          type="text"
          placeholder="Search tenants, invoices, users, logs..."
          className="w-full h-9 pl-9 pr-16 text-md  bg-white border border-slate-100 rounded-lg placeholder-slate-500 focus:outline-hidden focus:border-slate-200 transition"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <kbd className="inline-flex items-center gap-0.5 rounded-md border border-slate-200 bg-slate-50 px-2  py-1 text-[10px] font-bold text-primary/70">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Action Controls & Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Actions Button */}
        <button className="flex items-center gap-1 h-9 rounded-md border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-100 transition cursor-pointer">
          <Plus className="h-3.5 w-3.5 text-slate-500" />
          Quick actions
        </button>

        {/* Help icon */}
        <button className="text-primary hover:bg-slate-200 rounded-md p-1.5 cursor-pointer">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button className="relative text-primary hover:bg-slate-200 rounded-md p-1.5 cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="h-8 w-[1px] bg-slate-100 mx-1" />

        {/* User Info */}
        <div className="flex items-center gap-2.5">
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
  );
}