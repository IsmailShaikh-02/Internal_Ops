// src/shared/components/ui/DashboardCard.tsx

import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ChartCard({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: ChartCardProps) {
  return (
    <section
      className={cn(
        "rounded-xl border bg-card shadow-sm",
        className
      )}
    >
      <header className="flex items-start justify-between border-b px-6 py-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </header>

      <div className={cn("p-6", contentClassName)}>
        {children}
      </div>
    </section>
  );
}