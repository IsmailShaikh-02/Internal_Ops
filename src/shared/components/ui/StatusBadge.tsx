import { cn } from "@/shared/lib/utils";

type StatusVariant =
  | "success"
  | "warning"
  | "critical"
  | "info"
  | "neutral";

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<StatusVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-700",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700",
  critical:
    "border-red-200 bg-red-50 text-red-700",
  info:
    "border-blue-200 bg-blue-50 text-blue-700",
  neutral:
    "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({
  variant,
  children,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}