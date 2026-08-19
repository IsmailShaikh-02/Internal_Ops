import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Eye, EyeOff, Loader2, KeyRound, Mail, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const loginSchema = zod.object({
  email: zod
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid work email')
    .refine((val) => val.endsWith('@internalops.io'), {
      message: 'Authentication restricted to @internalops.io domains',
    }),
  password: zod
    .string()
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: zod.boolean().optional(),
});

type LoginFields = zod.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFields) => Promise<void>;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.endsWith('@internalops.io')) {
      toast.error('Please enter a valid @internalops.io work email');
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setIsForgotModalOpen(false);
      toast.success('Password reset link sent to your workspace inbox');
      setForgotEmail('');
    }, 1200);
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block" htmlFor="email">
            Work Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <Mail className="size-4" />
            </span>
            <input
              id="email"
              type="email"
              placeholder="username@internalops.io"
              autoComplete="email"
              disabled={loading}
              className={`w-full h-10 pl-9 pr-3 rounded-lg border bg-zinc-900/40 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 outline-none focus:border-zinc-500 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700 ${
                errors.email ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20' : 'border-zinc-800/80'
              }`}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-400 font-medium mt-1">
              <AlertCircle className="size-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block" htmlFor="password">
              Security Password
            </label>
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(true)}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
              <KeyRound className="size-4" />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={loading}
              className={`w-full h-10 pl-9 pr-10 rounded-lg border bg-zinc-900/40 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 outline-none focus:border-zinc-500 focus:bg-zinc-900/80 focus:ring-1 focus:ring-zinc-700 ${
                errors.password ? 'border-red-500/50 focus:border-red-500/80 focus:ring-red-500/20' : 'border-zinc-800/80'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="flex items-center gap-1 text-xs text-red-400 font-medium mt-1">
              <AlertCircle className="size-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Workstation Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer group text-xs text-zinc-400 select-none">
            <input
              type="checkbox"
              className="size-4 rounded border-zinc-800 bg-zinc-950/50 text-zinc-200 focus:ring-0 focus:ring-offset-0 focus:outline-none accent-zinc-500"
              {...register('rememberMe')}
            />
            <span className="group-hover:text-zinc-200 transition-colors">Remember this workstation</span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="outline"
          className="w-full h-10 justify-center rounded-lg border border-zinc-700 bg-zinc-100 text-zinc-950 font-semibold transition-all hover:bg-zinc-200 duration-150 active:scale-[0.98] cursor-pointer flex items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin text-zinc-950" />
              Verifying credentials...
            </>
          ) : (
            'Access Platform Console'
          )}
        </Button>
      </form>

      {/* SSO Section */}
      <div className="space-y-4">
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-zinc-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Identity Provider Integration
          </span>
          <div className="flex-grow border-t border-zinc-800"></div>
        </div>

        <button
          type="button"
          onClick={() => {
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 1500)),
              {
                loading: 'Connecting to Okta Workspace...',
                success: 'Okta authentication successful',
                error: 'Connection failed',
              }
            );
          }}
          className="w-full h-10 rounded-lg border border-zinc-850 bg-zinc-950/20 text-xs text-zinc-300 font-medium transition-all hover:bg-zinc-900/60 duration-200 flex items-center justify-center gap-2 hover:border-zinc-800 cursor-pointer"
        >
          <Sparkles className="size-3.5 text-zinc-400 animate-pulse" />
          Single Sign-On (Okta / SAML / Google Workspace)
        </button>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl relative">
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-zinc-100">
                <ShieldAlert className="size-5 text-amber-500" />
                <h3 className="text-base font-semibold">Workspace Security Verification</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Enter your work email address. If an active administrator account exists, a secure login link will be generated.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="username@internalops.io"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3.5 h-9 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors border border-transparent hover:border-zinc-800 bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 h-9 rounded-lg text-xs font-semibold bg-zinc-100 text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {forgotLoading && <Loader2 className="size-3.5 animate-spin" />}
                  Request Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
