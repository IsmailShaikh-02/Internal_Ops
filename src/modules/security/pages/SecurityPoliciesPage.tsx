// src/modules/security/pages/SecurityPoliciesPage.tsx

import { useState } from "react";
import { Switch } from "@/shared/components/ui/Switch";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import {
  Shield,
  Key,
  HelpCircle,
  Eye,
  Plus,
  X,
  Lock,
  Globe
} from "lucide-react";
import {
  validatePasswordLength,
  validateTimeout,
  validateFailedLimit,
  validateIpAddress
} from "../validation";

export function SecurityPoliciesPage() {
  // Password Policy
  const [minLen, setMinLen] = useState(12);
  const [reqUpper, setReqUpper] = useState(true);
  const [reqLower, setReqLower] = useState(true);
  const [reqNum, setReqNum] = useState(true);
  const [reqSpec, setReqSpec] = useState(true);
  const [expiry, setExpiry] = useState(90);
  const [hist, setHist] = useState(5);

  // Login Policy
  const [failedLimit, setFailedLimit] = useState(5);
  const [lockDuration, setLockDuration] = useState(15);
  const [captcha, setCaptcha] = useState(true);

  // Session Policy
  const [timeout, setTimeoutVal] = useState(30);
  const [concurrent, setConcurrent] = useState(3);
  const [autoLogout, setAutoLogout] = useState(true);

  // MFA Policy
  const [mfaMandatoryRoles, setMfaMandatoryRoles] = useState<string[]>(["owner", "admin"]);
  const [trustedDevices, setTrustedDevices] = useState(true);
  const [mfaFreq, setMfaFreq] = useState(30);

  // IP Policy lists
  const [allowList, setAllowList] = useState<string[]>(["192.168.1.0/24", "10.0.0.0/8"]);
  const [blockList, setBlockList] = useState<string[]>(["198.51.100.72"]);
  const [countryRestrictions, setCountryRestrictions] = useState<string[]>(["KP", "IR", "SY"]);

  const [newAllowIp, setNewAllowIp] = useState("");
  const [newBlockIp, setNewBlockIp] = useState("");
  const [newCountry, setNewCountry] = useState("");

  const handleAddAllowIp = () => {
    if (!newAllowIp.trim()) return;
    if (!validateIpAddress(newAllowIp.trim())) {
      toast.error("Invalid IP Address/CIDR format.");
      return;
    }
    setAllowList((prev) => [...prev, newAllowIp.trim()]);
    setNewAllowIp("");
    toast.success("Added to Allow List");
  };

  const handleAddBlockIp = () => {
    if (!newBlockIp.trim()) return;
    if (!validateIpAddress(newBlockIp.trim())) {
      toast.error("Invalid IP Address/CIDR format.");
      return;
    }
    setBlockList((prev) => [...prev, newBlockIp.trim()]);
    setNewBlockIp("");
    toast.success("Added to Block List");
  };

  const handleAddCountry = () => {
    if (!newCountry.trim()) return;
    setCountryRestrictions((prev) => [...prev, newCountry.trim().toUpperCase()]);
    setNewCountry("");
    toast.success("Added to Restricted Countries");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const pwdErr = validatePasswordLength(minLen);
    if (pwdErr) {
      toast.error(pwdErr);
      return;
    }

    const timeoutErr = validateTimeout(timeout);
    if (timeoutErr) {
      toast.error(timeoutErr);
      return;
    }

    const failedErr = validateFailedLimit(failedLimit);
    if (failedErr) {
      toast.error(failedErr);
      return;
    }

    toast.success("Advanced security policies updated console-wide immediately.");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl pb-12">
      {/* Save Button Header */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-indigo-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-700">Governance & Security Policy Console</span>
        </div>
        <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs py-2 px-6 cursor-pointer">
          Apply Security Changes
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
                onChange={(e) => setTimeoutVal(Number(e.target.value))}
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
              <label>Auto Logout on Inactivity</label>
              <Switch checked={autoLogout} onCheckedChange={setAutoLogout} />
            </div>
          </div>
        </div>

        {/* Login Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" /> Login & Lockout Policy
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
              <label>Enforce CAPTCHA on Authentication</label>
              <Switch checked={captcha} onCheckedChange={setCaptcha} />
            </div>
          </div>
        </div>

        {/* MFA Policy */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Eye className="h-4 w-4 text-slate-500" /> MFA Verification Policy
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Mandatory Roles (Comma-separated)</label>
              <input
                type="text"
                value={mfaMandatoryRoles.join(", ")}
                onChange={(e) => setMfaMandatoryRoles(e.target.value.split(",").map(s => s.trim()))}
                className="w-40 border rounded-lg px-2 py-1 bg-slate-50 font-bold text-xs"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Trusted Devices Skip</label>
              <Switch checked={trustedDevices} onCheckedChange={setTrustedDevices} />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <label>Verification Frequency (Days)</label>
              <input
                type="number"
                value={mfaFreq}
                onChange={(e) => setMfaFreq(Number(e.target.value))}
                className="w-16 text-center border rounded-lg py-1 bg-slate-50 font-bold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* IP Policy Settings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
          <Globe className="h-4 w-4 text-slate-500" /> IP & Location Perimeter Policies
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Allow List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">IP Allow List</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 192.168.1.0/24"
                value={newAllowIp}
                onChange={(e) => setNewAllowIp(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-750 focus:outline-none"
              />
              <Button type="button" onClick={handleAddAllowIp} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allowList.map((ip) => (
                <span key={ip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  {ip}
                  <button type="button" onClick={() => setAllowList(prev => prev.filter(x => x !== ip))} className="hover:text-emerald-950 font-bold">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Block List */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">IP Block List</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 198.51.100.72"
                value={newBlockIp}
                onChange={(e) => setNewBlockIp(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-750 focus:outline-none"
              />
              <Button type="button" onClick={handleAddBlockIp} className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {blockList.map((ip) => (
                <span key={ip} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  {ip}
                  <button type="button" onClick={() => setBlockList(prev => prev.filter(x => x !== ip))} className="hover:text-rose-950 font-bold">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Country Restrictions */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-650 uppercase tracking-wider">Restricted Countries</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="ISO code e.g. KP"
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-750 focus:outline-none"
              />
              <Button type="button" onClick={handleAddCountry} className="p-1.5 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {countryRestrictions.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold">
                  {c}
                  <button type="button" onClick={() => setCountryRestrictions(prev => prev.filter(x => x !== c))} className="hover:text-slate-950 font-bold">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SecurityPoliciesPage;
