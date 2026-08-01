import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { type Tenant } from "../data/mockTenants";
import { useTenantStore } from "../data/tenantStore";
import { Check, Palette, LayoutGrid } from "lucide-react";

interface BrandingTabProps {
  tenant: Tenant;
}

const availableColors = [
  { name: "Blue (Default)", class: "bg-blue-600", value: "#2563eb" },
  { name: "Emerald", class: "bg-emerald-600", value: "#059669" },
  { name: "Indigo", class: "bg-indigo-600", value: "#4f46e5" },
  { name: "Violet", class: "bg-violet-600", value: "#7c3aed" },
  { name: "Amber", class: "bg-amber-600", value: "#d97706" },
  { name: "Rose", class: "bg-rose-600", value: "#e11d48" },
];

export default function BrandingTab({ tenant }: BrandingTabProps) {
  const { updateTenant } = useTenantStore();
  const [companyName, setCompanyName] = useState(tenant.name);
  const [customDomain, setCustomDomain] = useState(tenant.domain);
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [logoInitials, setLogoInitials] = useState(
    tenant.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  );

  const handleSaveBranding = () => {
    updateTenant(tenant.id, {
      name: companyName,
      domain: customDomain,
    });
    alert("Branding settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Custom Branding</h3>
        <p className="text-xs text-slate-500 mt-0.5">Customize the appearance, portal theme, and network domain settings for this organization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Portal Card */}
          <Card className="border border-slate-200 shadow-xs rounded-xl bg-white p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-slate-500" />
              General Identity
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="company-name" className="text-xs font-bold text-slate-700">
                    Company Name
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      const init = e.target.value
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase();
                      setLogoInitials(init || "IO");
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="custom-domain" className="text-xs font-bold text-slate-700">
                    Custom Access Domain
                  </label>
                  <input
                    id="custom-domain"
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                </div>
              </div>

              {/* Theme Color Selection */}
              <div className="pt-2">
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Portal Primary Theme Accent
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-150 ${color.class} ${
                        selectedColor === color.value ? "ring-2 ring-slate-800 ring-offset-2 scale-105" : "hover:opacity-90"
                      }`}
                      title={color.name}
                    >
                      {selectedColor === color.value && <Check className="h-4 w-4 stroke-[3px]" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-slate-100 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setCompanyName(tenant.name);
                  setCustomDomain(tenant.domain);
                  setSelectedColor("#2563eb");
                }}
                className="bg-white border-slate-200 text-slate-700 shadow-none cursor-pointer"
              >
                Reset Default
              </Button>
              <Button 
                onClick={handleSaveBranding}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-none cursor-pointer"
              >
                Save Custom Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Side: Portal Preview Mockup */}
        <div className="space-y-6">
          <Card className="border border-slate-200 shadow-xs rounded-xl bg-slate-50 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Palette className="h-4 w-4 text-slate-500" />
                Live Preview
              </h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                This preview shows how the tenant's login screen header and portal navigation bar branding will display.
              </p>

              {/* Mini Console Preview Shell */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                <div className="h-6 bg-slate-900 px-3 flex items-center gap-1.5 border-b border-slate-800">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-bold text-[10px] tracking-wider transition-all duration-300"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {logoInitials}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-[10px] leading-tight">{companyName}</div>
                      <div className="text-[8px] text-slate-400 mt-0.5 leading-none">{customDomain}</div>
                    </div>
                  </div>
                  <div className="h-12 border border-dashed border-slate-200 rounded-md mt-3 flex items-center justify-center bg-slate-50/50">
                    <span className="text-[10px] text-slate-400 font-semibold">Workspace Content</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
