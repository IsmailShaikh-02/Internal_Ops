import type { ReactNode } from "react";
import { GlobalRail } from "@/shared/components/layout/GlobalRail";
import { ModuleSidebar } from "@/shared/components/layout/ModuleSidebar";
import { TopBar } from "@/shared/components/layout/TopBar";

interface ConsoleLayoutProps {
  children: ReactNode;
}

export function ConsoleLayout({
  children,
}: ConsoleLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">

      <GlobalRail />

      <div className="flex flex-1 min-w-0">

        <ModuleSidebar />

        <div className="flex flex-1 flex-col min-w-0">

          <TopBar />

          <main className="flex-1 overflow-auto p-6 bg-slate-50">
            {children}
          </main>

        </div>

      </div>

    </div>
  );
}