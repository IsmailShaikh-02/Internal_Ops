import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { GlobalRail } from "@/shared/components/layout/GlobalRail";
import { ModuleSidebar } from "@/shared/components/layout/ModuleSidebar";
import { TopBar } from "@/shared/components/layout/TopBar";
import { BottomNavigation } from "@/shared/components/layout/BottomNavigation";

interface ConsoleLayoutProps {
  children?: ReactNode;
}

export function ConsoleLayout({ children }: ConsoleLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* 1. DESKTOP ONLY: Persistent Global Rail (Hidden on mobile) */}
      <div className="hidden md:flex">
        <GlobalRail />
      </div>

      <div className="flex flex-1 min-w-0">
        {/* 2. DESKTOP ONLY: Persistent Module Sidebar (Hidden on mobile) */}
        <div className="hidden md:flex">
          <ModuleSidebar />
        </div>

        <div className="flex flex-1 flex-col min-w-0 h-full relative">
          {/* 3. TopBar (Compact Header) */}
          <TopBar />

          {/* 4. Scrollable Main Content Area */}
          {/* Note: pb-20 adds padding at the bottom so content isn't covered by the bottom bar on mobile */}
          <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
            {children ?? <Outlet />}
          </main>

          {/* 5. MOBILE ONLY: Fixed Thumb-First Bottom Bar & Drawer Triggers */}
          <div className="block md:hidden">
            <BottomNavigation />
          </div>
        </div>
      </div>
    </div>
  );
}