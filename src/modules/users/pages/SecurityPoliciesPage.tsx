// src/modules/users/pages/SecurityPoliciesPage.tsx

import { useState } from "react";
import { useUserState } from "../hooks/useUserState";
import { Switch } from "@/shared/components/ui/Switch";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { Shield, Key, Eye, HelpCircle } from "lucide-react";

export function SecurityPoliciesPage() {
  const { securityPolicy, roles, updateSecurityPolicy } = useUserState();

  // State copies for local editing
  const [minLen, setMinLen] = useState(securityPolicy.passwordPolicy.minimumLength);
  const [reqUpper, setReqUpper] = useState(securityPolicy.passwordPolicy.requireUppercase);
  const [reqLower, setReqLower] = useState(securityPolicy.passwordPolicy.requireLowercase);
  const [reqNum, setReqNum] = useState(securityPolicy.passwordPolicy.requireNumbers);
  const [reqSpec, setReqSpec] = useState(securityPolicy.passwordPolicy.requireSpecialChars);
  const [expiry, setExpiry] = useState(securityPolicy.passwordPolicy.expiryDays);
  const [hist, setHist] = useState(securityPolicy.passwordPolicy.historyCount);

  // MFA
  const [mfaEnabled, setMfaEnabled] = useState(securityPolicy.mfaPolicy.enabled);
  const [mfaMandatoryRoles, setMfaMandatoryRoles] = useState<string[]>(securityPolicy.mfaPolicy.mandatoryByRole || []);
  const [mfaRecovery, setMfaRecovery] = useState(securityPolicy.mfaPolicy.recoveryCodesEnabled);

  // Session
  const [timeout, setTimeout] = useState(securityPolicy.sessionPolicy.sessionTimeoutMinutes);
  const [concurrent, setConcurrent] = useState(securityPolicy.sessionPolicy.maxConcurrentSessions);
  const [rememberMe, setRememberMe] = useState(securityPolicy.sessionPolicy.rememberMeDurationDays);

  // Invite
  const [inviteExpiry, setInviteExpiry] = useState(securityPolicy.invitationPolicy.invitationExpiryHours);
  const [inviteApproval, setInviteApproval] = useState(securityPolicy.invitationPolicy.inviteApprovalRequired);
  const [inviteVerification, setInviteVerification] = useState(securityPolicy.invitationPolicy.emailVerificationRequired);

  // Login
  const [failedLimit, setFailedLimit] = useState(securityPolicy.loginPolicy.failedLoginLimit);
  const [lockDuration, setLockDuration] = useState(securityPolicy.loginPolicy.accountLockDurationMinutes);
  const [captcha, setCaptcha] = useState(securityPolicy.loginPolicy.captchaEnabled);

  const handleMfaRoleToggle = (roleId: string) => {
    setMfaMandatoryRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurityPolicy({
      passwordPolicy: {
        minimumLength: Number(minLen),
        requireUppercase: reqUpper,
        requireLowercase: reqLower,
        requireNumbers: reqNum,
        requireSpecialChars: reqSpec,
        expiryDays: Number(expiry),
        historyCount: Number(hist),
      },
      mfaPolicy: {
        enabled: mfaEnabled,
        mandatoryByRole: mfaMandatoryRoles,
        recoveryCodesEnabled: mfaRecovery,
      },
      sessionPolicy: {
        sessionTimeoutMinutes: Number(timeout),
        maxConcurrentSessions: Number(concurrent),
        rememberMeDurationDays: Number(rememberMe),
      },
      invitationPolicy: {
        invitationExpiryHours: Number(inviteExpiry),
        inviteApprovalRequired: inviteApproval,
        emailVerificationRequired: inviteVerification,
      },
      loginPolicy: {
        failedLoginLimit: Number(failedLimit),
        accountLockDurationMinutes: Number(lockDuration),
        captchaEnabled: captcha,
      },
    });
    toast.success("Security policies saved successfully and applied console-wide.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl pb-12">
      {/* Save Button Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-700">Governance & Security Controls</span>
        </div>
        <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs py-2 px-6 cursor-pointer">
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-slate-500" /> Password Policy
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Minimum Password Length</label>
              <input
                type="number"
                value={minLen}
                onChange={(e) => setMinLen(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Require Uppercase Letters</label>
              <Switch checked={reqUpper} onCheckedChange={setReqUpper} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Require Lowercase Letters</label>
              <Switch checked={reqLower} onCheckedChange={setReqLower} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Require Numbers</label>
              <Switch checked={reqNum} onCheckedChange={setReqNum} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Require Special Characters</label>
              <Switch checked={reqSpec} onCheckedChange={setReqSpec} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Password Expiry (Days)</label>
              <input
                type="number"
                value={expiry}
                onChange={(e) => setExpiry(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Enforce Password History (Count)</label>
              <input
                type="number"
                value={hist}
                onChange={(e) => setHist(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Multi-Factor Authentication */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-slate-500" /> Multi-Factor Authentication
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <div>
                <label className="block">Enable Multi-Factor Authentication</label>
                <span className="text-[10px] text-slate-400 font-normal">Recommend for all users</span>
              </div>
              <Switch checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Allow Recovery Codes</label>
              <Switch checked={mfaRecovery} onCheckedChange={setMfaRecovery} />
            </div>

            <div className="space-y-2 border-t pt-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Mandatory MFA by Role
              </label>
              <div className="space-y-1.5 max-h-[110px] overflow-y-auto">
                {roles
                  .filter((r) => r.status === "active")
                  .map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={mfaMandatoryRoles.includes(r.id)}
                        onChange={() => handleMfaRoleToggle(r.id)}
                        className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                      />
                      {r.roleName}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-slate-500" /> Session Policy
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Session Timeout (Minutes)</label>
              <input
                type="number"
                value={timeout}
                onChange={(e) => setTimeout(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Maximum Concurrent Sessions</label>
              <input
                type="number"
                value={concurrent}
                onChange={(e) => setConcurrent(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Remember Me Duration (Days)</label>
              <input
                type="number"
                value={rememberMe}
                onChange={(e) => setRememberMe(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Login Policy & Invitation Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
          {/* Login Policy */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Login & Lockout Policy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Failed Login Lockout Threshold</label>
                <input
                  type="number"
                  value={failedLimit}
                  onChange={(e) => setFailedLimit(Number(e.target.value))}
                  className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Lockout Duration (Minutes)</label>
                <input
                  type="number"
                  value={lockDuration}
                  onChange={(e) => setLockDuration(Number(e.target.value))}
                  className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Enforce CAPTCHA on Login</label>
                <Switch checked={captcha} onCheckedChange={setCaptcha} />
              </div>
            </div>
          </div>

          {/* Invitation Policy */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2">
              Invitation Policy
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Invitation Expiry (Hours)</label>
                <input
                  type="number"
                  value={inviteExpiry}
                  onChange={(e) => setInviteExpiry(Number(e.target.value))}
                  className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Invite Approval Required</label>
                <Switch checked={inviteApproval} onCheckedChange={setInviteApproval} />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <label>Force Email Verification</label>
                <Switch checked={inviteVerification} onCheckedChange={setInviteVerification} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SecurityPoliciesPage;
