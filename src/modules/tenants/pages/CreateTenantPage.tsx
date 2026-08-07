import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTenantStore } from "../data/tenantStore";
import { Button } from "@/shared/components/ui/button";
import { Check, ChevronLeft, ChevronRight, ArrowLeft, Building2, User, CreditCard, Puzzle, Palette, ClipboardList } from "lucide-react";
import { type Tenant } from "../data/mockTenants";
import { validateStep, type FormErrors } from "../validation/tenantValidation";
import { toast } from "sonner";

const steps = [
  { number: 1, name: "Organization Info", icon: Building2 },
  { number: 2, name: "Owner Details", icon: User },
  { number: 3, name: "Subscription Plan", icon: CreditCard },
  { number: 4, name: "Enable Modules", icon: Puzzle },
  { number: 5, name: "Custom Branding", icon: Palette },
  { number: 6, name: "Review & Confirm", icon: ClipboardList },
];

export default function CreateTenantPage() {
  const navigate = useNavigate();
  const { addTenant } = useTenantStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    phone: "",
    website: "",
    industry: "",
    region: "us-east",
    ownerName: "",
    ownerEmail: "",
    ownerMobile: "",
    ownerPassword: "",
    ownerDesignation: "",
    plan: "Growth",
    billingCycle: "Monthly",
    trialDays: "30",
    seatLimit: "100",
    modules: {
      HRMS: false,
      Payroll: false,
      Attendance: false,
      Recruitment: false,
      Assets: false,
      Projects: false,
    },
    logo: "",
    primaryColor: "#2563eb",
    secondaryColor: "#475569",
    companyDomain: "",
  });

  useEffect(() => {
    if (submitAttempted) {
      setErrors(validateStep(currentStep, form));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, currentStep]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateModule = (key: keyof typeof form.modules) => {
    setForm((prev) => ({
      ...prev,
      modules: { ...prev.modules, [key]: !prev.modules[key] },
    }));
  };

  const handleBlur = (key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const stepErrors = validateStep(currentStep, form);
    setErrors((prev) => ({ ...prev, [key]: stepErrors[key] }));
  };

  const fieldError = (key: string) =>
    (touched[key] || submitAttempted) ? errors[key] : undefined;

  const inputClass = (key: string) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all duration-150 ${
      fieldError(key)
        ? "border-red-400 focus:ring-red-300"
        : "border-slate-200 focus:ring-slate-400 hover:border-slate-300"
    }`;

  const handleNext = () => {
    setSubmitAttempted(true);
    const stepErrors = validateStep(currentStep, form);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      const firstErr = Object.values(stepErrors)[0];
      toast.error(firstErr || "Please fix validation errors.");
      return;
    }
    setSubmitAttempted(false);
    setTouched({});
    if (currentStep < 6) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setSubmitAttempted(false);
    setErrors({});
    setTouched({});
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    const newId = form.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const mappedModules = {
      HR: form.modules.HRMS,
      Finance: form.modules.Payroll,
      CRM: form.modules.Attendance,
      Inventory: form.modules.Recruitment,
      Docs: form.modules.Assets,
      Projects: form.modules.Projects,
      Analytics: true,
    };
    const calculatedMRR = form.plan === "Growth" ? 695 : 1500;
    const newTenant: Tenant = {
      id: newId,
      name: form.companyName,
      domain: form.companyDomain || `${newId}.internalops.app`,
      plan: form.plan,
      status: "Trial",
      users: 1,
      mrr: calculatedMRR,
      storageUsed: 0.1,
      storageLimit: 200,
      region: form.region,
      createdDate: new Date().toLocaleDateString("en-US"),
      owner: { name: form.ownerName, email: form.ownerEmail },
      modules: mappedModules,
    };
    addTenant(newTenant);
    navigate("/tenants");
  };

  const moduleDescriptions: Record<string, string> = {
    HRMS: "Employee records, org chart, onboarding",
    Payroll: "Salary runs, payslips, tax filings",
    Attendance: "Time tracking, shifts, leave management",
    Recruitment: "Job postings, pipelines, applicants",
    Assets: "Device tracking, assignments, audits",
    Projects: "Tasks, milestones, team collaboration",
  };

  const moduleIcons: Record<string, string> = {
    HRMS: "👥",
    Payroll: "💵",
    Attendance: "🕐",
    Recruitment: "📋",
    Assets: "🖥️",
    Projects: "📁",
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-5 p-4 md:p-1">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/tenants")}
          className="h-8 text-xs text-slate-500 hover:text-slate-800 p-0 font-medium cursor-pointer gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Tenants
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create new tenant</h1>
        <p className="text-sm text-slate-500">Provision a new client organization in the system.</p>
      </div>

      {/* Step Progress */}
      <div className="bg-white border border-slate-200 rounded-xl px-3 py-4 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.number;
            const isActive = currentStep === s.number;
            const Icon = s.icon;
            return (
              <div key={s.number} className="flex items-center gap-1 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    if (isCompleted) {
                      setCurrentStep(s.number);
                      setSubmitAttempted(false);
                      setErrors({});
                    }
                  }}
                  className={`flex flex-col items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 ${
                    isCompleted
                      ? "cursor-pointer hover:bg-primary/10"
                      : isActive
                      ? "cursor-default"
                      : "cursor-default opacity-50"
                  }`}
                >
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary text-white"
                        : isActive
                        ? "bg-primary text-white ring-2 ring-primary ring-offset-2"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-semibold whitespace-nowrap hidden sm:block ${
                      isActive ? "text-slate-900" : isCompleted ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`h-px flex-1 min-w-4 transition-colors duration-300 ${
                      currentStep > s.number ? "bg-slate-400" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          {(() => {
            const Icon = steps[currentStep - 1].icon;
            return (
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Icon className="h-4 w-4 text-white" />
              </div>
            );
          })()}
          <div>
            <h2 className="text-base font-bold text-slate-900">{steps[currentStep - 1].name}</h2>
            <p className="text-sm text-slate-400">Step {currentStep} of {steps.length}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-2 duration-200">
              {[
                { key: "companyName", label: "Company Name", placeholder: "Acme Corp", required: true, type: "text" },
                { key: "companyEmail", label: "Company Email", placeholder: "hello@acme.com", required: true, type: "email" },
                { key: "phone", label: "Phone", placeholder: "+1 (555) 000-0000", type: "text" },
                { key: "website", label: "Website", placeholder: "https://acme.com", type: "text" },
                { key: "industry", label: "Industry", placeholder: "Technology, Healthcare…", type: "text" },
              ].map(({ key, label, placeholder, required, type }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    onBlur={() => handleBlur(key)}
                    className={inputClass(key)}
                  />
                  {fieldError(key) && (
                    <p className="text-sm text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                      {fieldError(key)}
                    </p>
                  )}
                </div>
              ))}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">Region</label>
                <select
                  value={form.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  className={inputClass("region")}
                >
                  <option value="us-east">US East (N. Virginia)</option>
                  <option value="us-west">US West (Oregon)</option>
                  <option value="eu-west">EU West (Ireland)</option>
                  <option value="ap-southeast">AP Southeast (Singapore)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-2 duration-200">
              {[
                { key: "ownerName", label: "Owner Name", placeholder: "Jane Smith", required: true, type: "text" },
                { key: "ownerEmail", label: "Owner Email", placeholder: "jane@acme.com", required: true, type: "email" },
                { key: "ownerMobile", label: "Mobile", placeholder: "+1 (555) 000-0000", type: "text" },
                { key: "ownerDesignation", label: "Designation", placeholder: "CEO, Director…", type: "text" },
              ].map(({ key, label, placeholder, required, type }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    onBlur={() => handleBlur(key)}
                    className={inputClass(key)}
                  />
                  {fieldError(key) && (
                    <p className="text-sm text-red-500 animate-in fade-in duration-150">{fieldError(key)}</p>
                  )}
                </div>
              ))}
              <div className="space-y-1.5 col-span-full">
                <label className="text-sm font-bold text-slate-700">
                  Password <span className="font-normal text-slate-400">(optional — leave blank to send invite)</span>
                </label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.ownerPassword}
                  onChange={(e) => updateField("ownerPassword", e.target.value)}
                  onBlur={() => handleBlur("ownerPassword")}
                  className={inputClass("ownerPassword")}
                />
                {fieldError("ownerPassword") && (
                  <p className="text-sm text-red-500 animate-in fade-in duration-150">{fieldError("ownerPassword")}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { value: "Growth", price: "$695/mo", desc: "Up to 100 seats, core modules" },
                  { value: "Enterprise", price: "$1,500/mo", desc: "Unlimited seats, all modules + SLA" },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => updateField("plan", p.value)}
                    className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      form.plan === p.value
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    {form.plan === p.value && (
                      <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-slate-900 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="text-sm font-bold text-primary">{p.value}</div>
                    <div className="text-lg font-bold text-primary mt-0.5">{p.price}</div>
                    <div className="text-sm text-slate-500 mt-1">{p.desc}</div>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Billing Cycle</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => updateField("billingCycle", e.target.value)}
                    className={inputClass("billingCycle")}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly (save 15%)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Trial Days</label>
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={form.trialDays}
                    onChange={(e) => updateField("trialDays", e.target.value)}
                    onBlur={() => handleBlur("trialDays")}
                    className={inputClass("trialDays")}
                  />
                  {fieldError("trialDays") && (
                    <p className="text-sm text-red-500">{fieldError("trialDays")}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Seat Limit</label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={form.seatLimit}
                    onChange={(e) => updateField("seatLimit", e.target.value)}
                    onBlur={() => handleBlur("seatLimit")}
                    className={inputClass("seatLimit")}
                  />
                  {fieldError("seatLimit") && (
                    <p className="text-sm text-red-500">{fieldError("seatLimit")}</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Estimated MRR</div>
                  <div className="text-xl font-bold text-slate-900">
                    ${form.plan === "Growth" ? "695" : "1,500"}<span className="text-sm font-medium text-slate-400">/mo</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Trial period</div>
                  <div className="text-sm font-bold text-slate-700">{form.trialDays} days</div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="animate-in fade-in slide-in-from-right-2 duration-200">
              <p className="text-sm text-slate-500 mb-4">Toggle the modules enabled for this client workspace.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(form.modules).map(([key, isEnabled]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateModule(key as keyof typeof form.modules)}
                    className={`flex items-center gap-3 p-4 border rounded-xl text-left transition-all duration-200 cursor-pointer group ${
                      isEnabled
                        ? "border-slate-800 bg-slate-50 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`text-xl flex-shrink-0 transition-transform duration-200 ${isEnabled ? "scale-110" : "scale-100 group-hover:scale-105"}`}>
                      {moduleIcons[key]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-semibold text-primary block">{key}</span>
                      <span className="text-sm text-slate-400 truncate block">{moduleDescriptions[key]}</span>
                    </div>
                    <div
                      className={`h-5 w-9 rounded-full relative flex-shrink-0 transition-colors duration-200 ${
                        isEnabled ? "bg-primary" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform duration-200 ${
                          isEnabled ? "translate-x-4" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-3">
                {Object.values(form.modules).filter(Boolean).length} of {Object.keys(form.modules).length} modules enabled
              </p>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-primary">Company Domain</label>
                <input
                  type="text"
                  placeholder="acme.internalops.app"
                  value={form.companyDomain}
                  onChange={(e) => updateField("companyDomain", e.target.value)}
                  onBlur={() => handleBlur("companyDomain")}
                  className={inputClass("companyDomain")}
                />
                {fieldError("companyDomain") ? (
                  <p className="text-sm text-red-500">{fieldError("companyDomain")}</p>
                ) : (
                  <p className="text-sm text-slate-400">
                    Leave blank to auto-generate: {form.companyName ? `${form.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.internalops.app` : "company-name.internalops.app"}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "primaryColor", label: "Primary Color" },
                  { key: "secondaryColor", label: "Secondary Color" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-sm font-bold text-primary">{label}</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <input
                          type="color"
                          value={(form as any)[key]}
                          onChange={(e) => updateField(key, e.target.value)}
                          className="h-10 w-12 rounded-lg border border-slate-200 cursor-pointer bg-white p-1"
                        />
                      </div>
                      <input
                        type="text"
                        value={(form as any)[key]}
                        onChange={(e) => updateField(key, e.target.value)}
                        onBlur={() => handleBlur(key)}
                        className={`flex-1 ${inputClass(key)}`}
                        maxLength={7}
                      />
                    </div>
                    {fieldError(key) && (
                      <p className="text-xs text-red-500">{fieldError(key)}</p>
                    )}
                    <div
                      className="h-1.5 rounded-full mt-1 transition-colors duration-200"
                      style={{ backgroundColor: (form as any)[key] }}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-sm font-bold text-primary mb-3">Brand preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-sm font-bold transition-colors duration-200"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    {form.companyName ? form.companyName[0].toUpperCase() : "A"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-primary">{form.companyName || "Company Name"}</div>
                    <div className="text-sm" style={{ color: form.secondaryColor }}>{form.companyDomain || "company.internalops.app"}</div>
                  </div>
                  <button
                    type="button"
                    className="ml-auto text-sm font-semibold px-3 py-1.5 rounded-md text-white transition-colors duration-200"
                    style={{ backgroundColor: form.primaryColor }}
                  >
                    Sign in
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6 */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
              <p className="text-sm text-slate-500">Review the details below before provisioning the tenant.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: "Organization",
                    rows: [
                      { label: "Company", value: form.companyName || "—" },
                      { label: "Email", value: form.companyEmail || "—" },
                      { label: "Phone", value: form.phone || "—" },
                      { label: "Website", value: form.website || "—" },
                      { label: "Region", value: form.region },
                    ],
                  },
                  {
                    title: "Owner",
                    rows: [
                      { label: "Name", value: form.ownerName || "—" },
                      { label: "Email", value: form.ownerEmail || "—" },
                      { label: "Mobile", value: form.ownerMobile || "—" },
                      { label: "Role", value: form.ownerDesignation || "—" },
                    ],
                  },
                  {
                    title: "Subscription",
                    rows: [
                      { label: "Plan", value: `${form.plan} — $${form.plan === "Growth" ? "695" : "1,500"}/mo` },
                      { label: "Billing", value: form.billingCycle },
                      { label: "Trial", value: `${form.trialDays} days` },
                      { label: "Seats", value: form.seatLimit },
                    ],
                  },
                  {
                    title: "Branding",
                    rows: [
                      { label: "Domain", value: form.companyDomain || `${form.companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "company"}.internalops.app` },
                    ],
                    custom: (
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded border border-slate-200 flex-shrink-0" style={{ backgroundColor: form.primaryColor }} />
                          <span className="text-sm text-slate-600">{form.primaryColor} — primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="h-4 w-4 rounded border border-slate-200 flex-shrink-0" style={{ backgroundColor: form.secondaryColor }} />
                          <span className="text-sm text-slate-600">{form.secondaryColor} — secondary</span>
                        </div>
                      </div>
                    ),
                  },
                ].map((section) => (
                  <div key={section.title} className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                    <h4 className="text-sm font-bold text-primary">{section.title}</h4>
                    {section.rows.map((r) => (
                      <div key={r.label} className="flex justify-between items-start gap-2">
                        <span className="text-sm text-slate-500 flex-shrink-0">{r.label}</span>
                        <span className="text-sm font-semibold text-primary text-right truncate">{r.value}</span>
                      </div>
                    ))}
                    {section.custom}
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-primary mb-3">Enabled modules</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(form.modules)
                    .filter(([_, en]) => en)
                    .map(([key]) => (
                      <span key={key} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800">
                        {moduleIcons[key]} {key}
                      </span>
                    ))}
                  {Object.values(form.modules).every((v) => !v) && (
                    <span className="text-sm text-slate-400 italic">No modules enabled</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between mt-8 pt-5 border-t border-slate-100">
            <Button
              variant="outline"
              disabled={currentStep === 1}
              onClick={handleBack}
              className="border-slate-200 text-slate-600 font-medium cursor-pointer disabled:opacity-40 gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < 6 ? (
              <Button
                onClick={handleNext}
                className="bg-slate-900 hover:bg-slate-700 active:scale-95 text-white font-semibold cursor-pointer gap-1 transition-all duration-150"
              >
                Next step
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-700 active:scale-95 text-white font-bold cursor-pointer min-w-44 transition-all duration-150 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Provisioning…
                  </span>
                ) : (
                  "Provision tenant organization"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}