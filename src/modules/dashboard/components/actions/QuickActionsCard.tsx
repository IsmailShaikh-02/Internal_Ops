import { Plus, User, Megaphone, Wrench } from "lucide-react";
import type { QuickActionItem } from "../../types";

interface QuickActionsCardProps {
  data: QuickActionItem[];
}

export function QuickActionsCard({ data }: QuickActionsCardProps) {
  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case "plus":
        return <Plus className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      case "megaphone":
        return <Megaphone className="h-5 w-5" />;
      case "wrench":
        return <Wrench className="h-5 w-5" />;
      default:
        return <Plus className="h-5 w-5" />;
    }
  };

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="font-semibold text-foreground mb-4">Quick actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.map((action) => (
          <button
            key={action.id}
            className="flex flex-col items-center justify-center p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-background/50 hover:bg-muted/50 dark:hover:bg-muted/20 active:bg-muted/80 transition-all gap-3 cursor-pointer group"
          >
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-muted-foreground group-hover:text-foreground group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
              {getActionIcon(action.icon)}
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
