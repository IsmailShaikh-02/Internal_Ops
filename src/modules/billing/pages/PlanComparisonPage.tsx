import { useBillingStore } from "../hooks/useBillingState";
import { Check, Minus } from "lucide-react";

export function PlanComparisonPage() {
  const { plans } = useBillingStore();
  const activePlans = plans.filter((p) => p.status === "active");

  const comparisonFeatures = [
    { name: "Monthly Price", key: "price", format: (val: number) => `$${val}` },
    { name: "Included Seats", key: "seats", format: (val: number) => val.toLocaleString() },
    { name: "SSD Storage", key: "storageGb", format: (val: number) => val >= 1024 ? `${val / 1024} TB` : `${val} GB` },
    { name: "API Rate Limits", value: ["10k / hr", "50k / hr", "250k / hr", "Unlimited"] },
    { name: "SLA Guarantee", value: ["No SLA", "99.9%", "99.99%", "99.999% custom SLA"] },
    { name: "SSO (SAML/OIDC)", value: [false, false, true, true] },
    { name: "Audit Logging", value: [false, true, true, true] },
    { name: "24/7 Dedicated Support", value: [false, false, false, true] },
    { name: "Custom Domain Integration", value: [false, true, true, true] },
    { name: "Multi-Region Deploy", value: [false, false, false, true] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-800 tracking-tight mb-1">Plan Comparison Matrix</h3>
        <p className="text-xs text-slate-500 font-medium">Compare plans pricing limits and feature availability side-by-side.</p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="p-5 text-left text-sm font-bold text-slate-500 w-1/4">Features</th>
              {activePlans.map((plan) => (
                <th key={plan.id} className="p-5 text-center w-1/4">
                  <div className="space-y-1">
                    <p className="text-sm font-extrabold text-slate-800">{plan.name}</p>
                    <p className="text-xs font-semibold text-slate-500">${plan.price}/mo</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisonFeatures.map((feature, fIdx) => (
              <tr key={fIdx} className="hover:bg-slate-50/50">
                <td className="p-4 text-sm font-semibold text-slate-700">{feature.name}</td>
                {activePlans.map((plan, pIdx) => {
                  let cellContent: React.ReactNode = "";

                  if (feature.key) {
                    const value = plan[feature.key as keyof typeof plan];
                    cellContent = feature.format ? feature.format(value as any) : String(value);
                  } else if (feature.value) {
                    const val = feature.value[pIdx];
                    if (typeof val === "boolean") {
                      cellContent = val ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <Minus className="h-4 w-4 text-slate-300 mx-auto" />
                      );
                    } else {
                      cellContent = val;
                    }
                  }

                  return (
                    <td key={plan.id} className="p-4 text-center text-sm font-medium text-slate-600">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default PlanComparisonPage;
