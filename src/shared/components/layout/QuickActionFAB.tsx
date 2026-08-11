// src/shared/components/layout/QuickActionFAB.tsx
import { ChevronUp, Zap } from "lucide-react";
import { useFabGestures } from "../../hooks/useFabGestures";

interface QuickActionFABProps {
  onClick: () => void;
  onSwipeUp: () => void;
  hasRedZoneAlerts?: boolean;
}

export function QuickActionFAB({
  onClick,
  onSwipeUp,
  hasRedZoneAlerts = true, // Defaults to true to showcase the alert state
}: QuickActionFABProps) {
  const gestures = useFabGestures({ onClick, onSwipeUp });

  return (
    <div className="relative flex flex-col items-center shrink-0 select-none">
      
      {/* Pull Handle Visual Element: Upward chevron overlapping the top curve */}
      <div className={`absolute -top-3.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 pointer-events-none shadow-sm ${hasRedZoneAlerts ? "animate-bounce" : ""}`}>
        <ChevronUp className="h-3 w-3 stroke-[2.5]" />
      </div>

      {/* Main Gesture FAB */}
      <button
        type="button"
        {...gestures}
        onClick={onClick}
        className="touch-none flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-slate-950 to-slate-900 text-white shadow-xl active:scale-95 hover:shadow-emerald-500/10 hover:border-emerald-500/50 transition cursor-pointer border-2 border-slate-800 relative z-0"
        aria-label="Quick Action Center"
      >
        <Zap className="h-5 w-5 text-emerald-450 fill-emerald-450/20" />

        {/* Pulsing Red Zone Alerts Badge */}
        {hasRedZoneAlerts && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5 translate-x-0.5 -translate-y-0.5 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-450 opacity-75"></span>
            {/* <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-550 border border-slate-950"></span> */}
          </span>
        )}
      </button>

      {/* FAB Label */}
      <span className="text-[8px] font-bold text-slate-500 mt-1 block uppercase tracking-wider">
        Ops Center
      </span>
    </div>
  );
}
export default QuickActionFAB;
