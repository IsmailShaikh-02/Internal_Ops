import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;

  icon?: ReactNode;

  trend?: {
    value: string;
    direction: TrendDirection;
  };

  className?: string;
}

const trendStyles: Record<
  TrendDirection,
  {
    badge: string;
    icon: ReactNode;
  }
> = {
  up: {
    badge:
      "bg-green-100 text-green-700 hover:bg-green-100 border-transparent",
    icon: <TrendingUp className="h-3 w-3" />,
  },
  down: {
    badge:
      "bg-red-100 text-red-700 hover:bg-red-100 border-transparent",
    icon: <TrendingDown className="h-3 w-3" />,
  },
  neutral: {
    badge:
      "bg-muted text-muted-foreground border-transparent",
    icon: null,
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3 shadow-sm ",
        className
      )}
    >
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>

        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex flex-col items-start justify-center gap-2">
          {trend && (
            <Badge
              variant="secondary"
              className={trendStyles[trend.direction].badge}
            >
              {trendStyles[trend.direction].icon}
              {trend.value}
            </Badge>
          )}
          <h2 className="text-2xl font-semibold tracking-tight">
            {value}
          </h2>

        </div>

        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}