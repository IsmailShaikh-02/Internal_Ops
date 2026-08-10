// src/shared/components/layout/PageHeader.tsx

import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
}

interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  breadcrumb = [],
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
  <header className="w-full">
      {breadcrumb.length > 0 && (
        <nav className="flex items-center text-sm text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <div key={item.label} className="flex items-center">
              <span>{item.label}</span>

              {index < breadcrumb.length - 1 && (
                <ChevronRight className="mx-2 h-3.5 w-3.5" />
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex flex-col gap-3 mt-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}