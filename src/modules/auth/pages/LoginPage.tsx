import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { MOCK_USERS } from '@/shared/constants/mockUsers';
import type { PlatformUser } from '@/shared/types/auth.types';
import LoginForm from '../components/LoginForm';
import PersonaSelector from '../components/PersonaSelector';
import { toast } from 'sonner';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  // Determine redirection target path
  const from = (location.state as any)?.from || '/';

  const handlePersonaSelect = (user: PlatformUser) => {
    setSelectedUser(user);
    toast.success(`Selected persona: ${user.name} (${user.role})`);
  };

  const handleLoginSubmit = async (data: { email: string; password?: string }) => {
    setLoading(true);

    // Simulate enterprise auth request delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Resolve matching mock user or fallback
    let userToLogin = selectedUser;

    if (!userToLogin) {
      // Find mock user matching email
      const matched = Object.values(MOCK_USERS).find(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );
      if (matched) {
        userToLogin = matched;
      } else {
        // If not found, create a dynamic user profile or fallback
        const namePart = data.email.split('@')[0];
        const formattedName = namePart
          .split('.')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        userToLogin = {
          id: `usr_dyn_${Date.now()}`,
          name: formattedName || 'System Admin',
          email: data.email,
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          role: 'Super Admin', // default role
          permissions: MOCK_USERS.superadmin.permissions,
          status: 'Active',
          department: 'General Operations',
          mfaEnabled: false,
          lastLoginAt: new Date().toISOString(),
        };
      }
    }

    login(userToLogin);
    setLoading(false);
    toast.success(`Access granted. Welcome back, ${userToLogin.name}!`);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100">
      {/* Hero / Left Branding Panel */}
      <div className="flex-1 flex flex-col justify-between p-8 lg:p-12 bg-linear-to-b from-zinc-900 via-zinc-950 to-zinc-950 border-r border-zinc-900 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

        {/* Brand Header */}
        <div className="flex items-center gap-3 z-10">
          <div className="size-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-inner">
            <Cpu className="size-5 text-zinc-200" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-zinc-200">InternalOps</span>
            <span className="block text-[10px] text-zinc-500 font-mono leading-none mt-0.5">console.platform</span>
          </div>
          <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-semibold font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
            v1.0.0-PROD
          </span>
        </div>

        {/* Middle Hero Content */}
        <div className="my-16 lg:my-0 max-w-lg z-10 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300">
              <ShieldCheck className="size-3.5 text-zinc-400" />
              Unified Access Portal
            </span>
            <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-zinc-100 leading-tight">
              Manage enterprise infrastructure, billing, and tenancy.
            </h1>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Authorized operations personnel only. Multi-factor authentication layer active. Activities on this console are recorded for auditing and compliance tracking.
          </p>
        </div>

        {/* Footer Security Notice */}
        <div className="z-10 flex items-center gap-2.5 text-xs text-zinc-500 border-t border-zinc-900/60 pt-6">
          <ShieldAlert className="size-4 text-zinc-500 shrink-0" />
          <span>Restricted Internal System. Subject to real-time auditing and monitoring.</span>
        </div>
      </div>

      {/* Right Login Form / Persona Selector Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-zinc-950 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-200">Console Authentication</h2>
            <p className="text-xs text-zinc-500">Sign in with your organization domain account.</p>
          </div>

          <div className="space-y-4">
            {/* Quick Demo Persona Select */}
            <PersonaSelector onSelect={handlePersonaSelect} selectedUser={selectedUser} />

            {/* Email / Password Form */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 shadow-sm">
              <LoginForm onSubmit={handleLoginSubmit} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
