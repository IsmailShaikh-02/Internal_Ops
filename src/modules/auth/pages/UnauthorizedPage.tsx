import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Send, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const [requested, setRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = () => {
    setLoading(true);
    // Simulate sending permission elevation request
    setTimeout(() => {
      setLoading(false);
      setRequested(true);
      toast.success('Elevated permission request dispatched to Platform Owner approval queue.');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 font-sans select-none">
      <div className="w-full max-w-md text-center space-y-6">
        {/* Shield Icon Graphic */}
        <div className="mx-auto size-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/5 animate-pulse">
          <ShieldAlert className="size-8 text-red-400" />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">403: Security Violation</h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your current administrator role does not possess the permissions required to access this workspace module.
          </p>
        </div>

        {/* Console Details */}
        <div className="rounded-lg border border-zinc-900 bg-zinc-950/40 p-4 text-left font-mono text-[11px] text-zinc-500 space-y-1">
          <p><span className="text-zinc-400">Security Zone:</span> Protected Zone-1</p>
          <p><span className="text-zinc-400">Trigger Alert:</span> INSUFFICIENT_ACCESS_LEVEL</p>
          <p><span className="text-zinc-400">Timestamp:</span> {new Date().toISOString()}</p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="h-10 rounded-lg border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-200 text-xs font-semibold px-4 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            Switch Role
          </Button>

          <Button
            variant="default"
            disabled={requested || loading}
            onClick={handleRequestPermission}
            className={`h-10 rounded-lg text-xs font-semibold px-4 flex items-center gap-1.5 transition-all cursor-pointer ${
              requested
                ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                : 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border border-zinc-200'
            }`}
          >
            {loading ? (
              <span className="animate-spin size-3 border-2 border-zinc-950 border-t-transparent rounded-full" />
            ) : requested ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Send className="size-3.5" />
            )}
            {requested ? 'Elevation Requested' : 'Request Higher Permissions'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
